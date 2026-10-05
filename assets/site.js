const menuButton=document.querySelector('.menu-toggle'),navLinks=document.querySelector('.nav-links');
if(menuButton&&navLinks)menuButton.addEventListener('click',()=>{const open=navLinks.classList.toggle('open');menuButton.setAttribute('aria-expanded',String(open))});
const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');revealObserver.unobserve(entry.target)}}),{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));
const translations=Object.fromEntries([
['Skip to content','跳转到正文'],['Company','公司'],['Innovation','创新'],['Technology','技术'],['Applications','应用'],['Capabilities','核心能力'],['Attachments','接头系统'],['Architecture','系统架构'],['Metrics','性能指标'],['Explore the product','探索产品'],['Explore the system','探索系统'],['Toggle navigation','展开导航'],
['Intelligent EVA hardware','智能舱外作业硬件'],['Engineered for the work','为太空作业而设计'],['beyond.','面向更远的任务。'],['Gabbrotech develops intelligent tool systems for complex operations outside the spacecraft. Our first platform brings precise control, modular utility and confident handling into one handheld form.','Gabbrotech 专注于航天器外复杂作业的智能工具系统。首款平台将精准控制、模块化功能与可靠操作整合于一款手持设备。'],['Meet SmartTorque','认识 SmartTorque'],['Our approach','我们的理念'],['Hardware designed around the mission.','围绕任务需求设计硬件。'],['Outside the spacecraft, every movement matters. We bring product design, embedded intelligence and mechanical discipline together to make tool workflows clearer and more adaptable.','在航天器外，每一个动作都至关重要。我们将产品设计、嵌入式智能与精密机械结合，让工具操作更清晰、更灵活。'],['A multifunction EVA tool platform','多功能舱外作业工具平台'],['A powered tool platform supports interchangeable task heads, programmable motion, voice torque adjustment and attachment-lock control.','动力工具平台支持可更换任务接头、可编程运动控制、语音调节扭矩与接头锁控制。'],['Explore the platform','探索产品平台'],
['Less tool friction. More task focus.','减少工具切换，让任务更专注。'],['SmartTorque is built around three connected ideas: make settings intentional, change tasks quickly and retain control of every component.','SmartTorque 围绕三个理念构建：参数可设、任务切换快速、每个部件均可可靠固定。'],['Smart by design','智能控制'],['Use voice commands to adjust torque and open or close the attachment lock. Change the attachment manually after unlocking it.','通过语音调节扭矩、打开或关闭接头锁；开锁后手动更换接头。'],['Modular by nature','模块化设计'],['A standardized quick-change coupling connects scissor, plier and nut-driver attachments to one core tool body.','标准化快拆接口可连接剪切、钳类与螺母驱动接头，共用同一工具主体。'],['Built to stay with you','可靠连接，稳妥作业'],['A tool tether point and positive attachment lock are designed to reduce the risk of drifting or detached hardware.','系留点与接头锁止结构旨在降低工具漂浮或部件脱落的风险。'],
['The smallest delay can shape the whole task.','细微延误，也可能影响整项任务。'],['EVA work combines heavy gloves, limited time and unforgiving operating conditions. SmartTorque addresses practical sources of lost motion.','舱外作业需要穿戴厚重手套，时间有限，环境严苛。SmartTorque 针对常见操作阻滞进行设计。'],['Glove-limited input','手套影响操作'],['Voice control of torque and attachment locks, together with a readable LCD, reduces reliance on detailed button sequences.','语音调扭矩与控制接头锁与 LCD 显示屏可减少复杂按键操作。'],['Repeated tool changes','工具反复切换'],['Common coupling lets operators move between compatible operations with fewer separate devices.','通用接口让操作者使用更少独立工具完成多种兼容任务。'],['Loose hardware risk','部件漂浮风险'],['Tethering and locked attachments support deliberate handling in microgravity.','系留结构和锁止接头便于在微重力环境中可靠操作。'],['Variable task demands','任务需求各异'],['Programmable limits make rotational tasks easier to define and repeat.','可编程参数让旋转作业更容易设定和重复执行。'],
['Control from command to motion.','从指令到动作，全程可控。'],['The product concept combines an onboard voice-recognition module, LCD feedback and an Arduino-based control board with the mechanical tool platform.','产品概念将语音识别模块、LCD 信息反馈、Arduino 主板与机械工具平台整合在一起。'],['Configurable operation','可配置作业参数'],['Preset torque, rotational speed and turn count; stop or alert when a defined condition is reached.','预设扭矩、转速和转动圈数；达到设定条件后停止或提醒。'],['Integrated feedback','集成状态反馈'],['The LCD presents device parameters and key operating information where the user can check it.','LCD 显示设备参数和关键作业信息，方便操作者查看。'],['Environment-focused design','面向严苛环境设计'],['Structural, material and electronic protection is being designed for vacuum, temperature variation, radiation and electromagnetic interference.','结构、材料与电子系统正针对真空、温度变化、辐射和电磁干扰进行防护设计。'],['Adjust torque · lock / unlock','调节扭矩 · 开锁 / 闭锁'],['LCD display','LCD 显示屏'],['Review settings and state','查看参数与状态'],['Arduino-based control board','Arduino 控制主板'],['Torque · speed · turns','扭矩 · 转速 · 圈数'],['Modular output','模块化输出'],['Locked task attachment','锁止式任务接头'],
['One platform. A broader work envelope.','一个平台，拓展作业范围。'],['SmartTorque is conceived for maintenance tasks that benefit from adaptable handling and controlled powered motion.','SmartTorque 面向适合灵活操作和动力控制的维护任务而设计。'],['External maintenance','舱外维护'],['Fastening, handling and component work around spacecraft exteriors.','用于航天器外部紧固、抓取和部件操作。'],['Infrastructure servicing','基础设施维护'],['Support for repeated field tasks across future surface systems.','支持未来星表系统中的重复现场作业。'],['Hardware intervention','设备维护操作'],['Tool-assisted adjustments and repairs where precise settings matter.','用于需要精准参数控制的设备调整与维修。'],['Discover the thinking inside SmartTorque.','探索 SmartTorque 的设计理念。'],['Intelligent hardware concepts for work in demanding environments.','为严苛环境作业打造智能硬件概念。'],['Designed for deliberate action.','为精准作业而设计。'],
['Gabbrotech / SmartTorque','Gabbrotech / SmartTorque'],['Explore what makes','探索让每个动作'],['every action count.','都精准有效的设计。'],['Rotate the SmartTorque assembly, open it into an exploded view, and select each component to see its role in the system.','旋转 SmartTorque 装配体，展开爆炸视图，并选择部件查看其在系统中的作用。'],['ST / SYSTEM EXPLORER','ST / 系统探索'],['ASSEMBLED','装配状态'],['EXPLODED','爆炸视图'],['Preparing 3D model…','正在载入 3D 模型…'],['Drag or swipe to rotate · Scroll or pinch to zoom · Click model to open','拖动或滑动以旋转 · 滚动或双指缩放 · 点击模型以展开'],['Explode view','展开视图'],['Reassemble','重新装配'],['Reset view','重置视图'],['COMPONENT INSPECTION','部件查看'],['Explore the assembly','探索装配体'],['Select a component in the exploded view to learn how it fits into the system.','在爆炸视图中选择部件，了解它在系统中的作用。'],['Components','部件'],['Model from supplied CAD · component labels are functional interpretations','基于提供的 CAD 模型 · 部件名称为功能推断'],['Continue to product details','继续查看产品详情'],['Preset the action','预设作业参数'],['Switch the task','切换作业任务'],['Standard quick coupling','标准快拆接口'],['Keep it secure','可靠固定'],['Tether point · head lock','系留点 · 接头锁止'],
['A powered platform, not a single-purpose tool.','一套动力平台，不止一种用途。'],['SmartTorque combines a handheld powered tool platform with embedded control, interchangeable work heads and a workflow designed for gloved use.','SmartTorque 将手持动力平台、嵌入式控制与可更换工作头结合，并围绕戴手套的操作流程进行设计。'],['Set the operation. Select the head. Keep attention on','设定任务，选择接头，专注于'],['the task.','当前作业。'],['Built for adaptable work','为多任务作业而设计'],['The same body supports cutting, gripping and controlled nut driving through matched quick-change interfaces.','同一主体通过配套快拆接口支持剪切、钳类抓取与受控螺母驱动作业。'],['View task heads','查看任务接头'],['Intelligence where it helps most.','在关键环节提供智能辅助。'],['Each feature is intended to reduce a specific operating burden: finding a setting, changing a task, reading system state or retaining hardware.','各项功能针对具体操作负担进行设计：查找参数、切换任务、读取状态或固定部件。'],['Voice-controlled torque and head lock','语音调扭矩与控制接头锁'],['The voice recognition module accepts commands to adjust torque and open or close the attachment lock, reducing manual input when wearing heavy gloves.','语音识别模块接收调节扭矩、打开或关闭接头锁的指令，减少戴厚手套时的手动输入。'],['Programmable motion limits','可编程运动限制'],['Set torque, rotational speed and turn count. At the defined threshold, the system is designed to stop motion or alert the operator.','设定扭矩、转速和转动圈数。达到指定阈值时，系统设计为停止运动或提醒操作者。'],['At-a-glance LCD feedback','LCD 状态一目了然'],['A built-in display gives direct visibility into device settings and tool status during preparation and use.','内置显示屏可在准备和操作期间直接呈现设备参数与工具状态。'],['Secure by construction','结构可靠连接'],['A tether attachment point and positive head-locking mechanism are designed to keep the system and its modules together.','系留点和接头锁止结构旨在让工具主体与模块保持可靠连接。'],
['Change the head. Keep the workflow.','更换工作头，保持操作连贯。'],['A standardized quick-release interface connects specialized heads to the powered platform. Explore the primary attachments below.','标准快拆接口将专用工作头连接至动力平台。选择下方接头，了解其用途。'],['Nut driver','螺母螺丝刀头'],['Clamp','夹子头'],['Pliers','钳头'],['Attachment geometry and task suitability are part of the concept development process.','接头几何形状与任务适配性仍在概念开发中。'],['A clearer sequence for complex work.','让复杂作业步骤更清晰。'],['The operator stays in control while SmartTorque handles repeatable setup and monitored execution.','操作者始终掌握控制权，SmartTorque 辅助完成可重复的参数设定与状态监测。'],['Fit the head','安装接头'],['Connect a compatible attachment and confirm the positive lock.','连接兼容接头，并确认锁止到位。'],['Set torque','设置扭矩'],['Set the required torque by voice or manually. Unlock the attachment for a manual head change, then close the lock after fitting the next head.','通过语音或手动设置所需扭矩。更换接头时先开锁、手动换头，再闭锁固定。'],['Review settings','检查参数'],['Check torque, speed and turn count on the LCD before the action.','作业前通过 LCD 检查扭矩、转速与转动圈数。'],['Execute with feedback','根据反馈执行'],['Work to the programmed limit, with a stop or alert at the selected condition.','按设定限制执行，并在指定条件下停止或提醒。'],
['Designed around the realities of EVA.','围绕舱外作业的实际需求设计。'],['The platform concept responds to the constraints of gloved handling, limited task time and hardware accountability in microgravity.','该平台概念回应戴手套操作、作业时间有限和微重力环境下部件管理等约束。'],['Fewer manual inputs','减少手动输入'],['Voice adjustment of torque and head-lock control reduces fine manual input.','语音调节扭矩与控制接头锁，减少精细的手动输入。'],['Faster task transitions','更快切换任务'],['One body accepts multiple attachments through a common coupling.','通过通用接口，一个主体即可适配多个接头。'],['Repeatable execution','作业过程可重复'],['Programmed parameters support consistent rotational operations.','预设参数有助于保持旋转作业的一致性。'],['Retention built in','集成防脱设计'],['Locking heads and a tether point support hardware control.','接头锁止与系留点共同帮助管理工具和部件。'],['The components behind the control.','支撑智能控制的组成部分。'],['The current concept combines accessible operator interfaces with an Arduino-based controller, a powered drive and a modular mechanical output.','当前概念将便于操作的交互界面、Arduino 控制器、动力驱动与模块化机械输出结合。'],['Voice-recognition module','语音识别模块'],['Receives spoken instructions to adjust torque and open or close the attachment lock.','接收调节扭矩、打开或关闭接头锁的语音指令。'],['LCD screen','LCD 显示屏'],['Presents operating parameters and system feedback.','显示作业参数与系统反馈。'],['Arduino-based main board','Arduino 主板'],['Coordinates inputs, stored settings, sensing logic and motor-control commands in the prototype architecture.','在原型架构中协调输入、预存参数、传感逻辑和电机控制指令。'],['Powered drive and battery','动力驱动与电池'],['Supplies controlled motion and portable energy for repeated operations.','为重复作业提供受控运动和便携能源。'],['Quick-change coupling and retention','快拆接口与防脱结构'],['Connects task heads with a positive lock and supports tethering of the body.','通过锁止结构连接任务接头，并支持工具主体系留。'],['Protection designed into structure, materials and electronics.','从结构、材料和电子系统层面进行防护设计。'],['Development priorities include operation in vacuum, temperature variation, radiation exposure and electromagnetic interference. Qualification levels and test results will be published when verified.','开发重点包括真空、温度变化、辐射暴露和电磁干扰环境下的适应性。经验证后将公布相应等级与测试结果。'],['Arduino refers to the prototype control architecture. Flight electronics and environmental qualification require separate engineering validation.','此处 Arduino 指原型控制架构。飞行级电子设备及环境适应性仍需单独工程验证。'],['Measured by the work it enables.','以实际作业表现衡量。'],['Performance targets will be set against representative EVA task profiles and disclosed after testing. These are the measures that matter most.','性能目标将根据有代表性的舱外作业流程制定，并在测试后公布。以下是重点评估指标。'],['No numerical performance claims are presented as verified. The categories below define the evaluation framework for efficiency, reliability and endurance.','当前尚无经验证的量化性能声明。以下类别用于评估效率、可靠性与续航。'],['Efficiency','效率'],['Task completion time','任务完成时间'],['Elapsed time for a defined task sequence','完成指定任务流程所需时间'],['Validation pending','待验证'],['Attachment-switching time','接头切换时间'],['Time to remove, fit and confirm a head lock','拆卸、安装并确认接头锁止所需时间'],['Torque / speed accuracy','扭矩 / 转速精度'],['Deviation from commanded operating settings','实际作业参数与设定值的偏差'],['Reliability','可靠性'],['Successful operation rate','成功作业率'],['Completed actions across repeated trials','重复试验中成功完成的操作比例'],['System failure rate','系统故障率'],['Failures per defined operating interval','指定运行时长内的故障次数'],['Endurance','续航能力'],['Battery runtime','电池工作时长'],['Active operation across a representative duty cycle','代表性工作周期内的持续运行时间'],['Standby time','待机时间'],['Available idle duration between operations','两次作业之间可用的待机时长'],['Tasks per charge','单次充电任务数'],['Completed task cycles on one battery charge','单次充电可完成的任务循环数'],['Smarter Control. Steadier Missions.','智能控制，任务更稳。'],['See the company behind the platform.','了解平台背后的公司。'],['Explore Gabbrotech','探索 Gabbrotech'],['Intelligent hardware concepts for work in demanding environments.','为严苛环境作业打造智能硬件概念。'],['© 2026 Gabbrotech. Product concept and specifications subject to validation.','© 2026 Gabbrotech。产品概念与规格有待验证。'],['Smart. Steady. Space-Ready.','智能 · 稳定 · 面向太空作业。'],
['Powered body','动力工具主体'],['Drive platform','动力平台'],['Main powered housing and grip geometry. It anchors the tool, supports handheld handling, and carries the working head and control hardware.','动力工具主体与握持结构，为手持操作、工作头和控制硬件提供安装基础。'],['Lower locating pin','底部定位销'],['Mechanical detail','机械结构件'],['A small locating feature at the lower end of the assembly, represented as a separate part in the supplied CAD geometry.','装配体下部的定位结构，在提供的 CAD 几何中作为独立部件显示。'],['Side display panel','侧面显示面板'],['Operator interface','人机交互界面'],['The broad side-mounted panel provides the physical display surface for settings and operating feedback.','侧面的宽幅面板为参数和作业反馈提供显示区域。'],['Central coupler','中心联轴件'],['Drive train','传动机构'],['A compact coupler in the central motion path, linking the drive section to the tool-head assembly.','位于中心运动路径的紧凑联轴件，用于连接驱动段与工具头组件。'],['Pliers jaw · A','钳口 · A'],['Task head','任务工作头'],['One of the two shaped plier members at the working end of this CAD configuration.','当前 CAD 配置中工作端的一侧钳口。'],['Rotary gear set','旋转齿轮组'],['Geared geometry near the head translates controlled motor motion into the working mechanism.','工作头附近的齿轮结构将受控电机运动传递至执行机构。'],['Side gear plate · A','侧面齿轮板 · A'],['Head mechanism','工作头机构'],['A thin side plate forming part of the head’s geared linkage.','工作头齿轮连杆机构中的薄型侧板。'],['Side electronics board','侧置电子板'],['Control system','控制系统'],['A thin board-like module mounted along the side of the body. The product architecture includes voice input and an Arduino-based controller.','安装在主体侧面的薄型板状模块。产品架构包含语音输入和 Arduino 控制器。'],['Side gear plate · B','侧面齿轮板 · B'],['The matching side element of the head mechanism, retained as its own CAD part.','工作头机构的另一侧部件，在 CAD 中单独建模。'],['Side gear plate · C','侧面齿轮板 · C'],['A second matching side element supporting the head’s guided motion.','用于支撑工作头导向运动的另一侧部件。'],['Tool-head carrier','工作头承载座'],['Modular interface','模块化接口'],['The cylindrical carrier surrounds the head mechanism and provides the structural transition to the quick-change work end.','圆柱形承载座包围工作头机构，并连接至快拆工作端。'],['Pliers jaw · B','钳口 · B'],['The opposing plier member pairs with Jaw A for grasping and manipulation.','与钳口 A 相对配合，用于抓取和操作。'],['Head fastener · 1','工作头紧固件 · 1'],['Retention detail','固定结构'],['One of the small fasteners securing the upper tool-head mechanism.','用于固定上部工作头机构的小型紧固件之一。'],['Cross shaft','横向轴'],['A transverse shaft running through the upper mechanism to align its moving elements.','贯穿上部机构，用于对齐运动部件的横向轴。'],['Head fastener · 2','工作头紧固件 · 2'],['A second small fastener around the upper head assembly.','上部工作头组件周围的第二个小型紧固件。'],['Head support','工作头支撑件'],['A broad structural support around the working mechanism and its connection to the main body.','工作机构周围的宽幅结构支撑件，并连接至主体。'],['Side gear plate · D','侧面齿轮板 · D'],['A thin linkage plate on the opposite side of the head mechanism.','位于工作头机构另一侧的薄型连杆板。'],['Head fastener · 3','工作头紧固件 · 3'],['A retained fastening point on the opposite side of the upper head.','上部工作头另一侧的固定点。'],['Head fastener · 4','工作头紧固件 · 4'],['A companion fastening point stabilizing the upper head assembly.','用于稳定上部工作头组件的配套固定点。'],['Interface ring','接口环'],['The circular interface element between the powered platform and removable work-head structure.','位于动力平台与可拆卸工作头结构之间的圆形接口件。'],['Support bracket · A','支撑架 · A'],['Structure','结构件'],['A side bracket that holds adjacent upper and lower subassemblies in alignment.','用于保持相邻上下子组件对齐的侧面支架。'],['Electronics enclosure','电子设备外壳'],['An external structural enclosure around side-mounted control and interface hardware.','包围侧置控制与接口硬件的外部结构壳体。'],['Upper drive housing','上部驱动壳体'],['The wide central housing bridges the motor region, gear train, and removable tool head.','宽幅中心壳体连接电机区域、齿轮传动机构与可拆卸工作头。'],['Support bracket · B','支撑架 · B'],['The matching side bracket stabilizes the assembly across the opposite face.','位于相对侧、用于稳定装配体的配套支架。'],['Control mounting plate','控制器安装板'],['A compact mounting plate for the body-side electronics and mechanical interfaces.','用于安装主体侧电子设备与机械接口的紧凑安装板。']
].map(([en,zh])=>[en,zh]));
Object.assign(translations,{
  'Engineered for the work':'为太空作业而生',
  'beyond.':'把精准带到更远',
  'Explore what makes':'智能工具',
  'every action count.':'每个动作，尽在掌控',
  'Hardware designed around the mission.':'以任务为起点，打磨每一处设计',
  'Less tool friction. More task focus.':'简化操作，专注任务',
  'The smallest delay can shape the whole task.':'让每一次操作都更从容',
  'Control from command to motion.':'从语音指令到精准执行',
  'One platform. A broader work envelope.':'一套平台，拓展作业可能',
  'A powered platform, not a single-purpose tool.':'一体化动力平台，支持多种任务',
  'Intelligence where it helps most.':'把智能用在关键环节',
  'Change the head. Keep the workflow.':'快速换头，连贯作业',
  'A clearer sequence for complex work.':'复杂任务，清晰执行',
  'Designed around the realities of EVA.':'为真实的舱外作业需求而设计',
  'Performance, defined before it is claimed.':'以实测数据评估产品表现',
  'Discover the thinking inside SmartTorque.':'探索 SmartTorque 的设计与技术',
  'See the company behind the platform.':'了解 Gabbrotech',
  '01 / About Gabbrotech':'01 / 关于 Gabbrotech',
  '02 / Core innovation':'02 / 核心创新',
  '03 / Why it matters':'03 / 作业价值',
  '04 / Technology highlights':'04 / 技术亮点',
  '05 / Applications':'05 / 应用场景',
  '01 / What it is':'01 / 产品概览',
  '02 / Key features':'02 / 核心能力',
  '03 / Attachment system':'03 / 接头与适配',
  '04 / How it works':'04 / 操作流程',
  '05 / Why SmartTorque':'05 / 设计优势',
  '06 / System architecture':'06 / 系统架构',
  '07 / Key metrics':'07 / 性能评估',
  'Our point of view':'我们的设计理念',
  'Product proposition':'产品理念',
  'Design intent':'设计目标',
  'Flagship concept / SmartTorque':'旗舰产品 / SmartTorque',
  'When the environment raises the stakes, the tool should make the next action':'面对严苛环境，让每一次操作',
  'more deliberate.':'都有把握',
  'Intelligence at the interface':'智能交互',
  'Voice torque & head-lock control':'语音调扭矩与控制接头锁',
  'One platform, multiple tasks':'一机多用',
  'Quick-change attachments':'模块化快拆接头',
  'Control in every detail':'精准控制',
  'Precision-led operation':'参数可设，状态可见',
  '01 / CONTROL':'01 / 智能控制',
  '02 / UTILITY':'02 / 多任务能力',
  '03 / CONFIDENCE':'03 / 可靠连接',
  '01 / Command':'01 / 语音指令',
  '02 / Control':'02 / 参数控制',
  '03 / Feedback':'03 / 状态反馈',
  '04 / Retention':'04 / 防丢失设计',
  '01 / ORBITAL':'01 / 舱外作业',
  '02 / SURFACE':'02 / 星表作业',
  '03 / ROBOTICS':'03 / 机器人维护',
  'Voice commands':'语音指令',
  'Motor control':'电机控制',
  'Gabbrotech / Intelligent EVA tools':'Gabbrotech / 智能舱外工具',
  'Our mission is to design intelligent EVA tools that improve astronaut efficiency and operational safety. SmartTorque brings voice interaction, modular task heads, tool retention and readable feedback into one practical platform.':'我们的使命是设计智能化舱外工具，提升宇航员的工作效率与操作安全。SmartTorque 将语音互动、多种接头、防丢失结构和直观反馈整合于一套实用平台。',
  'Intelligent tools. More confident astronauts.':'设计智能工具，让宇航员从容作业',
  'Our team starts with the realities of EVA: heavy gloves, repeated task changes and the need to keep every tool secure. These constraints guide our vision of tools that make complex operations easier to understand and carry out.':'我们从舱外作业的实际需求出发：厚重手套、反复切换任务，以及始终固定好每一件工具。这些需求引导我们设计更容易理解、更便于执行复杂操作的工具。',
  'Our mission':'团队使命',
  'Design intelligent EVA tools that improve':'设计智能化舱外工具，提升',
  'efficiency and operational safety.':'工作效率与操作安全',
  '02 / Core advantages':'02 / 核心优势',
  'Four advantages. One practical platform':'四项核心优势，一套实用平台',
  'Voice interaction, adaptable heads, retention hardware and clear LCD feedback address the practical demands of work outside the spacecraft.':'语音互动、可更换接头、防丢失结构与清晰的 LCD 反馈，回应舱外作业中的实际需求。',
  '01 / VOICE':'01 / 语音互动','02 / MODULARITY':'02 / 多种接头','03 / RETENTION':'03 / 防丢失设计','04 / FEEDBACK':'04 / 直观显示',
  'Fewer input errors':'减少操作失误',
  'Voice commands adjust torque and lock or unlock the attachment, reducing manual input and helping avoid operating mistakes in heavy gloves.':'通过语音调节扭矩、控制接头锁开关，减少戴厚重手套时的手动输入，降低操作失误风险。',
  'More tasks, one body':'一机适配多种任务',
  'Scissor, plier and nut-driver heads adapt the same powered body to different operating modes and tasks.':'剪切头、钳头与螺母螺丝刀头，让同一动力本体适应不同模式与作业任务。',
  'Keep the tool with you':'让工具始终可靠连接',
  'A printed collar, curved ring and locked attachments are designed to reduce the risk of losing tools or components.':'打印扣环、弧形系留环与接头锁止结构，旨在降低工具或部件丢失的风险。',
  'State at a glance':'设备状态一目了然',
  'The LCD makes device parameters and working status visible, so the operator can review settings before acting.':'LCD 直观显示设备参数和工作状态，便于操作者在执行前确认设置。',
  'Simple interfaces':'简洁交互','Intelligent assistance':'智能辅助','Practical utility':'实用功能','Industrial precision':'工业精度',
  'An intelligent EVA tool designed for astronaut efficiency and operational safety. Rotate the assembly, inspect its components, then drive the gears to see each head at work.':'面向宇航员工作效率与操作安全设计的智能舱外工具。旋转装配体、查看部件，再拖动齿轮，观察不同接头的工作演示。',
  'Adjust torque and open or close the attachment lock by voice. Unlock the head, replace it manually, then lock it in place.':'通过语音调节扭矩、打开或关闭接头锁。更换接头时，先开锁、手动换头，再闭锁固定。',
  'The LCD directly displays device parameters and working status, helping the operator confirm settings before each action.':'LCD 直观显示设备参数与工作状态，便于每次操作前确认设置。',
  'The printed collar, curved ring and head-locking structure are designed to reduce tool-loss risk during handling and task changes.':'打印扣环、弧形环扣与接头锁止结构，旨在降低操作与任务切换时的工具丢失风险。',
  'Scissors':'剪切头',
  'Explore all three supplied CAD configurations: scissors, pliers and nut driver.':'三种真实 CAD 配置均可查看：剪切头、钳头和螺母螺丝刀头。',
  '02 / Precision':'02 / 精密控制',
  '03 / Awareness':'03 / 状态感知',
  'Environment-led design':'面向环境的防护设计',
  'Retention & adaptation':'防丢失与适配设计',
  'Stay connected through every task':'让每一项作业都保持可靠连接',
  'A dedicated printed collar and curved ring form the retention interface. Each task head uses a matched mounting structure to connect with the powered body.':'专用打印扣环与弧形环扣构成防丢失接口。不同任务接头通过配套安装结构，与电钻本体完成适配。',
  'One body, matched interfaces':'一个主体，配套接口',
  'Powered body':'动力工具主体',
  'Matched printed adapter':'配套打印适配件',
  'Locked task head':'锁止式任务接头',
  'Head-specific mounting parts align the attachment with the drive platform. Switch between the supplied scissor, plier and nut-driver assemblies to explore their different structures.':'接头专用安装件将工作端与动力平台连接。切换剪切头、钳头和螺母螺丝刀的真实 CAD 装配体，查看三种接头的适配结构。',
  'A physical retention path':'实体防丢失连接结构',
  'Printed retention collar':'打印扣环',
  'Curved ring':'弧形环扣',
  'Tether connection':'系留连接点',
  'The printed collar provides the body-side interface; the curved ring provides a connection for a tool tether. Inspect both original CAD parts in the explorer.':'打印扣环提供工具本体侧的适配接口，弧形环扣为工具系绳提供连接位置。可在爆炸视图中分别查看两件原始 CAD 零件。',
  'Inspect the retention parts':'查看防丢失零件',
  'Ring placement is a fit visualization; final mounting position is to be confirmed in the assembly.':'环扣位置为适配展示；最终安装位置需在完整装配体中确认。',
  'Actual pliers and nut-driver geometry is available in the 3D explorer. The clamp is a planned attachment.':'3D 探索区已支持真实钳头和螺母螺丝刀模型；夹子接头为规划功能。',
  'Encoder and feedback shaft':'编码器与反馈轴',
  'The encoder, shaft and associated gears provide a mechanical path for rotational feedback in the prototype.':'编码器、编码轴及配套齿轮构成原型中的旋转反馈机构。'
  ,'Smart. Steady. Space-ready.':'智能 · 稳定 · 面向太空作业'
  ,'Geometry and component names from supplied CAD':'几何结构与部件名称均来自提供的 CAD'
});
Object.assign(translations,{'Inspect voice module':'查看语音模块','Inspect tether parts':'查看系留零件','Inspect LCD feedback':'查看 LCD 反馈','Interactive previews of the operating workflow':'操作流程交互示意'});
translations['Intelligent tools for EVA']='面向舱外作业的智能工具';
Object.assign(translations,{
  'Voice-controlled torque and head lock':'语音调节扭矩与控制接头锁',
  'Voice torque & head-lock control':'语音调扭矩与控制接头锁',
  'Voice control of torque and attachment locks, together with a readable LCD, reduces reliance on detailed button sequences.':'语音调节扭矩与控制接头锁，配合清晰的 LCD 显示，减少繁琐的按键操作。',
  'Adjust torque · lock / unlock':'调节扭矩 · 开锁 / 闭锁'
});
const textSources=new WeakMap();
let language=localStorage.getItem('gabbrotech-language')||'en';
let theme=localStorage.getItem('gabbrotech-theme')||'dark';
function applyLanguage(){
  document.documentElement.lang=language==='zh'?'zh-CN':'en';
  document.title=language==='zh'?(location.pathname.includes('smarttorque')?'SmartTorque — 智能舱外多功能工具 | Gabbrotech':'Gabbrotech — 面向太空作业的智能工具'):(location.pathname.includes('smarttorque')?'SmartTorque — Intelligent EVA Multi-Tool | Gabbrotech':'Gabbrotech — Intelligent Tools for the Work Beyond');
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  while(walker.nextNode()){const node=walker.currentNode;if(node.parentElement.closest('[data-i18n-skip]'))continue;if(!textSources.has(node))textSources.set(node,node.nodeValue);const source=textSources.get(node),key=source.trim(),leading=source.match(/^\s*/)?.[0]||'',trailing=source.match(/\s*$/)?.[0]||'';node.nodeValue=leading+(language==='zh'?(translations[key]||key):key)+trailing;}
  document.querySelectorAll('h1,h2,h3').forEach(heading=>{const nodes=[];const walk=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);while(walk.nextNode())nodes.push(walk.currentNode);const last=nodes.reverse().find(node=>node.nodeValue.trim());if(last)last.nodeValue=last.nodeValue.replace(/[。.]\s*$/,'');});
  if(language==='zh'){const mission=document.querySelector('.statement p');if(mission?.firstChild?.nodeType===Node.TEXT_NODE)mission.firstChild.nodeValue=mission.firstChild.nodeValue.trimEnd();}
  const langButton=document.querySelector('[data-ui="language"]'),themeButton=document.querySelector('[data-ui="theme"]');
  if(langButton){langButton.textContent=language==='en'?'中文':'EN';langButton.setAttribute('aria-label',language==='en'?'切换到中文':'Switch to English');}
  if(themeButton)themeButton.setAttribute('aria-label',theme==='dark'?(language==='en'?'Switch to light mode':'切换浅色模式'):(language==='en'?'Switch to dark mode':'切换深色模式'));
  if(menuButton)menuButton.setAttribute('aria-label',language==='en'?'Toggle navigation':'展开导航');
}
function applyTheme(){document.documentElement.dataset.theme=theme;const button=document.querySelector('[data-ui="theme"]');if(button)button.textContent=theme==='dark'?'◐':'☼';applyLanguage();window.dispatchEvent(new CustomEvent('site-theme-change',{detail:{theme}}));}
window.applySiteLanguage=applyLanguage;
window.siteLanguage=()=>language;
window.siteText=text=>language==='zh'?(translations[text]||text):text;
document.querySelector('[data-ui="language"]')?.addEventListener('click',()=>{language=language==='en'?'zh':'en';localStorage.setItem('gabbrotech-language',language);applyLanguage();window.dispatchEvent(new CustomEvent('site-language-change',{detail:{language}}));});
document.querySelector('[data-ui="theme"]')?.addEventListener('click',()=>{theme=theme==='dark'?'light':'dark';localStorage.setItem('gabbrotech-theme',theme);applyTheme();});
applyTheme();
const tabs=document.querySelectorAll('[data-attachment]'),detail=document.querySelector('#attachment-detail');
const attachmentData={
  driver:{title:'Nut-driver head',role:'CONTROLLED HEX FASTENING',description:'A socket-style attachment for turning compatible nuts. Preset torque, speed and turn count support repeatable fastening and unfastening.',icon:'<circle cx="90" cy="90" r="64" fill="none" stroke="currentColor" stroke-width="2"/><path d="M90 34v84m-20-20 20 20 20-20M61 146h58" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>'},
  scissors:{title:'Scissor head',role:'CONTROLLED CUTTING',description:'The original scissor mechanism from Assembly 1. Its paired blades, linkage rods and dedicated mounting adapter connect cutting tasks to the powered body.',icon:'<circle cx="90" cy="90" r="64" fill="none" stroke="currentColor" stroke-width="2"/><path d="m58 42 61 93M122 42l-61 93" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/><circle cx="57" cy="138" r="14" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="123" cy="138" r="14" fill="none" stroke="currentColor" stroke-width="4"/><circle cx="90" cy="90" r="5" fill="currentColor"/>'},
  pliers:{title:'Pliers head',role:'GRIP AND MANIPULATION',description:'A plier-style attachment for controlled gripping and manipulation of suitable parts through the shared platform.',icon:'<circle cx="90" cy="90" r="64" fill="none" stroke="currentColor" stroke-width="2"/><path d="M84 84 70 69 64 42 76 47 81 65 90 74 99 65 104 47 116 42 110 69 96 84" fill="currentColor" fill-opacity=".1" stroke="currentColor" stroke-width="5" stroke-linejoin="round"/><path d="M84 96C77 111 68 121 65 141M96 96C103 111 112 121 115 141" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round"/><circle cx="90" cy="87" r="12" fill="none" stroke="currentColor" stroke-width="5"/><circle cx="90" cy="87" r="3" fill="currentColor"/>'}
};
const attachmentZh={driver:['螺母驱动','螺母螺丝刀头','用于旋拧兼容螺母的套筒式接头。预设扭矩、转速和圈数可支持重复的紧固与拆卸。'],scissors:['受控剪切','剪切头','来自装配体1的原始剪切机构。上剪、下剪刀片与推杆配合，通过专用安装适配件连接电钻本体，完成适用材料的剪切任务。'],pliers:['抓取与操作','钳头','通过共用平台实现对适用部件的受控抓取与操作。']};
function setAttachment(key,sync=true){const d=attachmentData[key];if(!d||!detail)return;const zh=language==='zh',tr=attachmentZh[key];detail.setAttribute('data-i18n-skip','');detail.innerHTML='<div class="attachment-visual" aria-hidden="true"><svg viewBox="0 0 180 180">'+d.icon+'</svg></div><div class="attachment-copy"><small>'+(zh?tr[0]:d.role)+'</small><h3>'+(zh?tr[1]:d.title)+'</h3><p>'+(zh?tr[2]:d.description)+'</p><a class="btn btn-ghost" href="#explore">'+(zh?'在 3D 中查看接头':'Inspect this head in 3D')+'</a></div>';tabs.forEach(tab=>{const selected=tab.dataset.attachment===key;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;});if(sync)window.dispatchEvent(new CustomEvent('attachment-choice',{detail:{head:key}}));}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>setAttachment(tab.dataset.attachment));tab.addEventListener('keydown',event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();const next=(index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;tabs[next].focus();setAttachment(tabs[next].dataset.attachment);}});});
if(tabs.length)setAttachment('driver');
window.addEventListener('site-language-change',()=>{const current=[...tabs].find(tab=>tab.getAttribute('aria-selected')==='true');if(current)setAttachment(current.dataset.attachment,false);});
window.addEventListener('cad-head-change',e=>setAttachment(e.detail.head,false));





