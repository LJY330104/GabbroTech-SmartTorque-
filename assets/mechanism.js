import * as THREE from 'three';

// Kinematic illustration using the native CAD pivots. No forces, contact
// constraints or verified operating limits are implied by this presentation.
export class Mechanism {
  constructor(onChange){this.onChange=onChange;this.parts=[];this.phase=0;this.running=false;this.last=0;this.head='scissors';}
  setParts(parts,head){
    this.stop();this.restore();this.parts=parts;this.head=head;this.phase=0;
    this.jaws=parts.filter(p=>/上剪|下剪|上钳|下钳/.test(p.partName));
    for(const part of parts){
      part.restQuaternion??=part.object.quaternion.clone();
      part.restScale??=part.object.scale.clone();
      part.restMatrix=new THREE.Matrix4().compose(part.start,part.restQuaternion,part.restScale);
    }
    for(const part of parts){
      if(this.jaws.includes(part)){
        const c=part.nativeBounds.getCenter(new THREE.Vector3());
        const relative=c.clone().applyQuaternion(part.restQuaternion);
        const tangent=new THREE.Vector3(-c.y,c.x,0).applyQuaternion(part.restQuaternion);
        part.openDirection=Math.sign(relative.x*tangent.x)||1;
      }
      if(/^推杆/.test(part.partName)){
        const side=Math.sign(part.start.x);
        const jaw=this.jaws.find(j=>Math.sign(j.start.x+j.nativeBounds.getCenter(new THREE.Vector3()).applyQuaternion(j.restQuaternion).x)===side);
        if(jaw){
          const end=new THREE.Vector3(.0255,0,0).applyMatrix4(part.restMatrix);
          part.link={jaw,anchor:part.start.clone().applyMatrix4(jaw.restMatrix.clone().invert()),end,length:end.distanceTo(part.start)};
        }
      }
    }
    this.apply(0);
  }
  restore(){for(const p of this.parts){p.geometry.quaternion.copy(p.geometryRestQuaternion);p.geometry.position.copy(p.geometryRestPosition);if(p.restQuaternion)p.object.quaternion.copy(p.restQuaternion);if(p.motionTranslation)p.object.position.sub(p.motionTranslation);p.motionTranslation=new THREE.Vector3();}}
  spin(part,axis,angle){
    const q=new THREE.Quaternion().setFromAxisAngle(axis,angle);
    // CAD gear and blade axes pass through the native part origin.
    part.geometry.quaternion.copy(q).multiply(part.geometryRestQuaternion);
    part.geometry.position.copy(part.geometryRestPosition).applyQuaternion(q);
  }
  apply(phase){
    this.phase=phase;
    const opening=(1-Math.cos(phase))*.11;
    for(const p of this.parts){
      if(/力矩盘/.test(p.partName))this.spin(p,new THREE.Vector3(0,1,0),phase);
      else if(/舵机15齿/.test(p.partName))this.spin(p,new THREE.Vector3(0,1,0),-phase*2);
      else if(/编码器.*齿轮/.test(p.partName)){
        const size=p.nativeBounds.getSize(new THREE.Vector3()),axis=size.x<size.y&&size.x<size.z?new THREE.Vector3(1,0,0):size.y<size.z?new THREE.Vector3(0,1,0):new THREE.Vector3(0,0,1);
        this.spin(p,axis,phase);
      }
      else if(this.jaws.includes(p))this.spin(p,new THREE.Vector3(0,0,1),opening*p.openDirection);
      else if(this.head==='driver'&&/^_+/.test(p.partName)&&p.nativeBounds.getSize(new THREE.Vector3()).y>.1)this.spin(p,new THREE.Vector3(0,1,0),phase);
    }
    for(const p of this.parts.filter(p=>p.link)){
      const {jaw,anchor,end,length}=p.link;
      const movedAnchor=anchor.clone().applyQuaternion(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,0,1),opening*jaw.openDirection)).applyMatrix4(jaw.restMatrix);
      const tip=end.clone();const dx=tip.x-movedAnchor.x,dz=tip.z-movedAnchor.z;
      tip.y=movedAnchor.y-Math.sqrt(Math.max(0,length*length-dx*dx-dz*dz));
      const rotation=new THREE.Quaternion().setFromUnitVectors(end.clone().sub(p.start).normalize(),tip.sub(movedAnchor).normalize());
      p.object.quaternion.copy(rotation).multiply(p.restQuaternion);
      p.object.position.sub(p.motionTranslation||new THREE.Vector3());
      p.motionTranslation=movedAnchor.sub(p.start);p.object.position.add(p.motionTranslation);
    }
    this.onChange?.(this);
  }
  setPhase(phase){this.running=false;this.last=0;this.apply(phase);}
  play(){this.running=true;this.last=0;this.onChange?.(this);}
  stop(){this.running=false;this.last=0;this.onChange?.(this);}
  reset(){this.running=false;this.last=0;this.restore();this.apply(0);}
  step(now){if(!this.running)return false;const delta=this.last?Math.min((now-this.last)/1000,.04):0;this.last=now;this.apply((this.phase+delta*1.8)%(Math.PI*4));return true;}
  get drivingGear(){return this.parts.find(p=>/力矩盘/.test(p.partName));}
  isGear(p){return !!p&&/力矩盘|舵机15齿|编码器.*齿轮/.test(p.partName);}
}
