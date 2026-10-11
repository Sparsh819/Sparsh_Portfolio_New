/*
 * Portfolio content. Every figure here comes from Sparsh's resume (Core_Aero3),
 * the previous portfolio site, or details he supplied directly.
 * Edit this file to update content; main.js renders everything from it.
 */
window.PORTFOLIO = {
  person: {
    name: "Sparsh Bandi",
    tagline: "Aerospace and Aerial Robotics Enthusiast",
    email: "sparshbandi@gmail.com",
    github: "https://github.com/Sparsh819",
    linkedin: "https://www.linkedin.com/in/sparsh-bandi-376046320/",
    resume: "assets/docs/Sparsh_Bandi_Resume.pdf",
  },

  /* Intrinsic pixel sizes, used for width/height attributes (prevents layout shift). */
  dims: {
    abh1: [899, 1599], abh2: [1599, 1200], pcb3d: [1050, 681], schem: [1186, 848],
    rockets: [1440, 1440], icarus: [1440, 1440], boeing: [799, 1599], latfull: [819, 1456],
    latsim: [1393, 868], poker1: [719, 880], poker2: [719, 474], ecell: [1440, 1440],
    tennis: [467, 613], bball: [721, 1568], uzhavu: [1129, 1600], cad_iso: [1097, 760],
    cad_top: [1259, 1307], cad_front: [1304, 365], cad_side: [1230, 360],
    "hero-avionics-bay": [784, 1180], "resume-p1": [1656, 2339], "resume-p2": [1656, 2339],
  },

  /* Images where the full-size file is a lossless PNG (technical evidence). */
  lossless: ["pcb3d", "schem"],

  categories: [
    { id: "all", label: "All work" },
    { id: "rocketry", label: "Rocketry & avionics" },
    { id: "uav", label: "UAVs & aircraft" },
    { id: "research", label: "Research & computation" },
    { id: "competitions", label: "Competitions & leadership" },
  ],

  projects: [
    {
      id: "abhyuday",
      title: "Team Abhyuday",
      subtitle: "SRAD avionics for a 10,000 ft rocket at IREC, USA",
      cats: ["rocketry"],
      status: "ongoing",
      period: "Sep 2025 – present",
      org: "Team Abhyuday · IIT Madras",
      role: "Sole avionics member of the 6-person IREC delegation; payload vertical lead",
      cover: "abh2",
      tools: ["STM32H7", "KiCad", "Embedded C", "LoRa", "Python", "ANSYS HFSS", "Featherweight GPS"],
      metrics: [
        ["8,000 ft", "AGL — team’s launch at IREC, USA"],
        ["3.3 kN", "Peak thrust, hybrid hot-fire (4.5 s burn)"],
        ["7 km", "Bidirectional LoRa telemetry link"],
        ["143", "Teams in the IREC field"],
      ],
      summary:
        "Designed the rocket’s student-built flight computer, telemetry, power system and ground station, then flew it at IREC in the 10,000 ft COTS category.",
      overview:
        "Abhyuday is IIT Madras’s student rocketry team. For the International Rocket Engineering Competition (IREC) in the USA, the team flew a rocket in the 10,000 ft COTS category with student-researched-and-designed (SRAD) avionics. I was the only avionics member of the six-person delegation that travelled to the competition, and I represented the avionics systems in the Flight Safety Review and in technical conversations with engineers from Blue Origin and SpaceX.",
      contribution: [
        ["Flight computer", "Designed a 4-layer STM32H7 PCB from scratch over four months: 7+ sensors and 15+ components, with the embedded firmware for flight logic and recovery actuation."],
        ["Sensor fusion", "Implemented both Madgwick and Kalman filters on the flight computer, switchable in firmware."],
        ["Telemetry", "Built the LoRa uplink/downlink that streams live AGL altitude, velocity and heading over a 7 km bidirectional link."],
        ["Power", "Designed a custom 7S / 25.9 V battery-management system with multi-rail buck regulation: 5 V for the flight computer, 7.7 V for airbrakes and 24 V for the actuation motor, keeping subsystems electrically isolated."],
        ["Ground station", "Built an SRAD ground station that automates hybrid-engine fill sequences over LoRa, and a Python GUI that parses live NMEA packets from a Featherweight GPS into a real-time 3D trajectory."],
        ["Payload (CARIS)", "Designed, routed and fabricated FR4 phased-array antenna PCBs (2.4 GHz, 3 elements per antenna), tuned in ANSYS HFSS; built the RF telemetry circuit and a dedicated payload flight computer."],
      ],
      specs: [
        ["MCU", "STM32H7"],
        ["9-axis IMU", "ICM-20948"],
        ["High-g accelerometer", "H3LIS331DL"],
        ["GNSS", "u-blox MAX-M10S"],
        ["Board", "4-layer PCB, CHILE-V1"],
        ["Fusion", "Madgwick + Kalman (switchable)"],
        ["Power", "7S / 25.9 V BMS → 5 V · 7.7 V · 24 V"],
        ["Link", "LoRa, 7 km bidirectional"],
      ],
      challenges: [
        ["A drogue charge that didn’t fire", "In flight, the SRAD CO₂ drogue ejection failed. The redundant deployment channel on the SRAD flight computer fired the drogue instead, and dual deployment with reefing completed. The rocket was recovered with no damage to the avionics bay or payload."],
        ["Three voltages from one pack", "The flight computer, airbrakes and actuation motor run at 5 V, 7.7 V and 24 V. Separate buck-regulated rails from a single 7S / 25.9 V pack keep each subsystem’s power isolated."],
        ["Two estimators, one switch", "The firmware carries both a Madgwick and a Kalman filter and can switch between them, so either estimator can run on the same hardware."],
      ],
      outcomes: [
        "Cleared the IREC Flight Safety Review for launch",
        "Successful launch to 8,000 ft AGL; dual deployment with reefing; recovered without damage to avionics or payload",
        "Two hybrid-engine hot-fire tests at Thaiyur: 3.3 kN peak thrust, 4.5 s burn, diamond shock structure observed",
      ],
      gallery: [
        { img: "abh1", kind: "photo", caption: "Team Abhyuday at IREC, USA: the delegation on stage, launch-site preparation, and the rocket at the pad." },
        { img: "abh2", kind: "photo", caption: "The delegation with the rocket (left) and the integrated avionics bay with its wiring harness (right)." },
        { img: "pcb3d", kind: "pcb", label: "PCB-01 · 3D RENDER", caption: "3D render of the 4-layer STM32H7 flight-computer board, as designed." },
        { img: "schem", kind: "pcb", label: "SCH-01 · CHILE-V1", caption: "CHILE-V1 flight-computer schematic, full sheet." },
        { img: "rockets", kind: "photo", caption: "Abhyuday rockets on the launch rail, in the workshop and on display." },
      ],
    },
    {
      id: "icarus",
      title: "Project Icarus Prime",
      subtitle: "Stealth STOL UAV for autonomous swarm defence",
      cats: ["uav"],
      status: "completed",
      period: "Jun 2025 – Mar 2026",
      org: "Aero Club · IIT Madras",
      role: "Airframe research, vision model and autonomy tuning",
      cover: "icarus",
      tools: ["YOLOv11", "ArduPilot", "NACA 9415", "Python"],
      metrics: [
        ["2", "Patents filed"],
        ["500+", "Images in the training set"],
        ["0.6", "Detection confidence on real aerial targets"],
        ["5+", "Papers reviewed for the design"],
      ],
      summary:
        "A short-take-off stealth UAV built around a NACA 9415 airfoil, with a YOLOv11 detector and geofenced ArduPilot autonomy. Two patents filed.",
      overview:
        "Icarus Prime is an Aero Club IIT Madras project to build a stealth short-take-off-and-landing (STOL) UAV for autonomous swarm-defence missions. The work led to two patent filings on radar-integrated interception and onboard vision.",
      contribution: [
        ["Airframe", "Reviewed 5+ papers and engineered the STOL stealth design around a NACA 9415 airfoil."],
        ["Vision", "Trained a YOLOv11 detection model on 500+ images, reaching 0.6 confidence against real aerial targets."],
        ["Autonomy", "Tuned the ArduPilot flight controller with a geofence for fully autonomous swarm-interception missions."],
        ["Patents", "Filed two patents: object detection and guidance, and visual drone detection and interception using radar-integrated systems."],
      ],
      pipeline: ["Onboard vision", "YOLOv11 detection", "Guidance logic", "ArduPilot, geofenced", "Autonomous interception"],
      outcomes: ["Two patents filed", "Autonomous mission execution inside a configured geofence"],
      next: "Ikshan — a separate, ongoing Aero Club UAV: a stealth flying wing with distributed electric propulsion on a blended wing body and YOLO guidance on a Jetson Nano, being built by a team of five.",
      gallery: [
        { img: "icarus", kind: "photo", caption: "Icarus Prime airframe builds, ground testing and fabrication sessions." },
      ],
    },
    {
      id: "aeromodelling",
      title: "Boeing National Aeromodelling",
      subtitle: "Payload-drop aircraft and the Aero Club build season",
      cats: ["uav"],
      status: "completed",
      period: "Sep 2025 – Mar 2026",
      org: "Aero Club · IIT Madras",
      role: "Aero Club Coordinator; airframe builds, payload electronics, piloting",
      cover: "boeing",
      tools: ["Fusion 360", "CNC machining", "Brushless propulsion", "ArduPilot"],
      metrics: [
        ["1.6×", "Thrust-to-weight, against a 1.3× minimum"],
        ["460 g", "Payload (10 golf balls) released in flight"],
        ["5+", "CNC-machined 1.5 m balsa airframes"],
        ["7+ / 4+", "Fixed-wing aircraft / quadcopters built as Coordinator"],
      ],
      summary:
        "Balsa airframes built to fly 30 seconds with maximum payload, then drop it in flight. Designed in Fusion 360 and CNC-machined.",
      overview:
        "The Boeing National Aeromodelling Competition asks teams to fly for 30 seconds carrying as much payload as possible and then release it mid-flight. As Aero Club Coordinator for the 2025–26 season, I represented IIT Madras and led the club’s build cycles.",
      contribution: [
        ["Airframes", "Built 5+ CNC-machined 1.5 m balsa airframes, designed in Fusion 360."],
        ["Propulsion", "850 KV brushless motor on 4S, reaching a thrust-to-weight of 1.6× against the 1.3× minimum."],
        ["Payload electronics", "Engineered the onboard electronics that release a 460 g payload (10 golf balls) after a 30-second powered cruise."],
        ["Club leadership", "Led full build cycles for 7+ fixed-wing RC aircraft and 4+ quadcopters; trained on fixed-wing and multirotor flight with ArduPilot simulators and manual flying."],
      ],
      outcomes: ["Represented IIT Madras at the national championship", "Payload release after a 30 s powered cruise"],
      model: true,
      gallery: [
        { img: "boeing", kind: "photo", caption: "Competition aircraft builds and the team with balsa airframes." },
        { img: "cad_iso", kind: "cad", caption: "Aero Club balsa aircraft design, rendered directly from the Fusion 360 STL export." },
        { img: "cad_top", kind: "cad", caption: "Plan view of the same model." },
      ],
    },
    {
      id: "valkron",
      title: "Valkron Dynamics",
      subtitle: "Real-time vision and guidance for autonomous UAV tracking",
      cats: ["uav"],
      status: "completed",
      period: "Jul – Aug 2025",
      org: "Valkron Dynamics · early-stage UAV startup",
      role: "Research Intern",
      cover: null,
      tools: ["YOLO", "ROS2", "PID control", "XFOIL", "Python"],
      metrics: [
        ["30%", "Lower inference latency in the YOLO pipeline"],
        ["50+", "Autonomous aerial missions with PID guidance"],
      ],
      summary:
        "Cut detection latency by 30% and wrote ROS2 guidance logic that ran across 50+ autonomous missions.",
      overview:
        "Valkron Dynamics is an early-stage startup building real-time autonomous UAV tracking with computer vision and embedded guidance. I joined for the summer as a research intern.",
      contribution: [
        ["Detection", "Optimised the real-time YOLO object-detection pipeline, reducing inference latency by 30%."],
        ["Guidance", "Implemented PID-based guidance logic in ROS2, validated across 50+ autonomous aerial missions."],
        ["Aerodynamics", "Built UAV aerodynamic models for reliable autonomous flight."],
      ],
      pipeline: ["Camera frames", "YOLO detection", "Target tracking", "PID guidance (ROS2)", "UAV mission"],
      outcomes: ["30% lower inference latency", "Guidance validated over 50+ missions"],
      gallery: [],
    },
    {
      id: "lat",
      title: "LAT Aerospace · Inter IIT",
      subtitle: "Upper-surface-blowing aerodynamics, matched to CFD",
      cats: ["research"],
      status: "completed",
      period: "Inter IIT Tech Meet 14.0 · Dec 2025",
      org: "Inter IIT Tech Meet 14.0, IIT Patna · problem statement by LAT Aerospace",
      role: "Sole modeller in a 30-member IIT Madras team",
      cover: "latsim",
      tools: ["Python", "Coanda / jet-flap theory", "CFD validation", "Optimisation"],
      metrics: [
        ["0.5%", "Error against high-fidelity CFD"],
        ["~100×", "Lower compute time than CFD"],
        ["4.5", "CL max from coflow-jet analysis"],
        ["50+", "Angle-of-attack configurations"],
      ],
      summary:
        "A 2D Python model of upper-surface blowing on the S1223 airfoil that matched CFD within 0.5% at about a hundredth of the compute.",
      overview:
        "LAT Aerospace’s Inter IIT problem asked for fast models of upper-surface-blowing (USB) lift augmentation. I built thick jet-flap interaction models and validated them against high-fidelity CFD.",
      contribution: [
        ["Model", "Built a 2D Python USB model for the S1223 airfoil: an 86 mm jet at 70% chord, with the Coanda effect and variable density."],
        ["Optimisation", "Optimised 6 parameters across 50+ angle-of-attack configurations."],
        ["Validation", "Matched CFD within 0.5% error at roughly 100× lower compute time."],
        ["Augmentation", "Ran a coflow-jet lift-augmentation analysis reaching CL max of 4.5."],
      ],
      pipeline: ["S1223 geometry", "Jet + Coanda model", "6-parameter optimisation", "CFD comparison", "CL vs α sweeps"],
      outcomes: ["Within 0.5% of CFD", "~100× faster than CFD for preliminary design sweeps"],
      gallery: [
        { img: "latsim", kind: "tech", caption: "The Python USB model’s interface: S1223 geometry with jet trajectories (CL_total = 3.609 for the case shown)." },
        { img: "latfull", kind: "photo", caption: "Certificate of participation, the team at Inter IIT, and model output." },
      ],
    },
    {
      id: "attitude",
      title: "Attitude Estimation",
      subtitle: "9-DOF IMU fusion with a live artificial horizon",
      cats: ["research"],
      status: "completed",
      period: "Course project · CH2013",
      org: "IIT Madras · Prof. Aravind Kumar",
      role: "Individual course project · highest grade",
      cover: null,
      tools: ["MATLAB", "Arduino", "Complementary filter", "Signal filtering"],
      metrics: [
        ["100 Hz", "Fusion rate"],
        ["30 fps", "Horizon and roll-pitch-yaw display"],
        ["3", "One-pole low-pass filters (5 / 5 / 25 Hz)"],
      ],
      summary:
        "A MATLAB estimator fusing gyro, accelerometer and magnetometer at 100 Hz, validated on a live Arduino IMU.",
      overview:
        "A 9-DOF attitude estimator in MATLAB that fuses IMU data with a complementary filter and visualises roll, pitch and yaw in a cockpit-style display.",
      contribution: [
        ["Fusion", "Coded a complementary filter fusing gyro, accelerometer and magnetometer at 100 Hz, with tunable fusion gains (ALPHA) per axis."],
        ["Filtering", "Designed three one-pole low-pass filters: 5 Hz for the accelerometer, 5 Hz for the magnetometer and 25 Hz for the gyro."],
        ["Display", "Built a 30 fps artificial horizon and roll-pitch-yaw plot with a 10 s sliding window."],
        ["Validation", "Ran it on live serial data from an Arduino-connected IMU."],
      ],
      pipeline: ["Gyro · 25 Hz LPF", "Accel · 5 Hz LPF", "Mag · 5 Hz LPF", "Complementary filter · 100 Hz", "Horizon · 30 fps"],
      outcomes: ["Highest grade in the course project"],
      gallery: [],
    },
    {
      id: "dpca",
      title: "Dynamic PCA Paper",
      subtitle: "Benchmarking fault detection on the Tennessee Eastman Process",
      cats: ["research"],
      status: "completed",
      period: "Course project · CH5440",
      org: "IIT Madras · Prof. Kannan A",
      role: "Author",
      cover: null,
      tools: ["Python", "PCA / DPCA", "Statistical process monitoring"],
      metrics: [
        ["15+", "Papers synthesised"],
        ["7", "Methods benchmarked"],
        ["53", "Process variables"],
        ["21", "Fault scenarios"],
      ],
      summary:
        "A 5,500-word paper benchmarking Dynamic PCA against six other fault-detection methods, with a from-scratch Python implementation.",
      overview:
        "A research paper on multivariate statistical process monitoring for chemical plants, written for Multivariate Data Analysis (CH5440).",
      contribution: [
        ["Review", "Synthesised 15+ papers on Dynamic PCA and process monitoring into a 5,500-word paper."],
        ["Benchmark", "Compared DPCA with PCA, KPCA, CVA, ICA, SFA and autoencoders on the Tennessee Eastman Process."],
        ["Implementation", "Implemented DPCA from scratch in Python, with control-chart visualisations across 53 variables and 21 fault scenarios."],
      ],
      outcomes: ["Completed paper and Python implementation"],
      gallery: [],
    },
    {
      id: "pokerbots",
      title: "IIT PokerBots",
      subtitle: "Runner-up, Jane Street-sponsored inter-IIT bot competition",
      cats: ["competitions"],
      status: "completed",
      period: "Feb – Mar 2026",
      org: "IIT PokerBots · sponsored by Jane Street",
      role: "Team bot design",
      cover: "poker2",
      tools: ["Python", "Monte Carlo methods", "Game theory"],
      metrics: [
        ["2nd", "Overall, from 500+ teams across the top 10 IITs"],
        ["₹60,000", "Prize"],
        ["100%", "Score in the hackathon finals"],
      ],
      summary:
        "A poker bot combining Vickrey auction theory, Monte Carlo equity estimation and adaptive opponent modelling.",
      overview:
        "IIT PokerBots is a bot-versus-bot poker competition open to teams from India’s top IITs, sponsored by Jane Street.",
      contribution: [
        ["Strategy", "Integrated Vickrey auction theory for the bidding round, Monte Carlo equity estimation, and adaptive opponent modelling."],
        ["Result", "Perfect score in the hackathon finals; runner-up overall from 500+ teams; ₹60,000 prize."],
      ],
      outcomes: ["Runner-up overall", "Perfect score in the finals"],
      gallery: [
        { img: "poker2", kind: "photo", caption: "Runner-up prize presentation at IIT PokerBots." },
        { img: "poker1", kind: "photo", caption: "Presenting at IIT PokerBots." },
      ],
    },
    {
      id: "ecell",
      title: "E-Cell Startup Services",
      subtitle: "Associate Manager, Entrepreneurship Cell, IIT Madras",
      cats: ["competitions"],
      status: "completed",
      period: "Nov 2024 – Apr 2025",
      org: "Entrepreneurship Cell · IIT Madras",
      role: "Associate Manager, Startup Services",
      cover: "ecell",
      tools: ["Partnerships", "Event operations", "Founder outreach"],
      metrics: [
        ["1,500+", "Startups connected to incubators and investors"],
        ["800+", "Startups drawn to PitchFest"],
        ["8", "Pan-India meetups, 1,100+ founders and VCs"],
      ],
      summary:
        "Co-created PitchFest and connected 1,500+ startups with IvyCap, T-Hub, India Accelerator and Atal Incubation Centre.",
      overview:
        "Startup Services is the E-Cell team that connects early-stage founders with incubators, investors and each other.",
      contribution: [
        ["PitchFest", "Co-created PitchFest, IIT Madras’s first Shark Tank-style event, recruiting 4 angel investors as judges; it drew 800+ startups."],
        ["Meetups", "Led 8 pan-India startup meetups with 1,100+ founders and VCs."],
        ["Partnerships", "Connected 1,500+ startups with IvyCap, T-Hub, India Accelerator and Atal Incubation Centre."],
      ],
      outcomes: ["PitchFest launched", "1,500+ startups connected"],
      gallery: [{ img: "ecell", kind: "photo", caption: "Startup Services events and team, E-Cell IIT Madras." }],
    },
  ],

  experience: [
    { period: "Sep 2025 – present", role: "Avionics & Electronics", org: "Team Abhyuday, IIT Madras", note: "Sole avionics member of the IREC delegation: flight computer, telemetry, power, ground station; payload vertical lead.", link: "abhyuday" },
    { period: "Sep 2025 – Mar 2026", role: "Coordinator", org: "Aero Club, IIT Madras", note: "Led build cycles for 7+ fixed-wing aircraft and 4+ quadcopters; represented IIT Madras at the Boeing national championship.", link: "aeromodelling" },
    { period: "Jul – Aug 2025", role: "Research Intern", org: "Valkron Dynamics", note: "Real-time YOLO detection (30% lower latency) and PID guidance in ROS2 across 50+ autonomous missions.", link: "valkron" },
    { period: "Nov 2024 – Apr 2025", role: "Associate Manager, Startup Services", org: "Entrepreneurship Cell, IIT Madras", note: "Co-created PitchFest; 8 pan-India meetups; 1,500+ startups connected to incubators and investors.", link: "ecell" },
  ],

  competitions: [
    { name: "IIT PokerBots", result: "Runner-up · ₹60,000", note: "Perfect score in the Jane Street-sponsored finals; 500+ teams.", link: "pokerbots" },
    { name: "IMC Prosperity 4", result: "Rank 8 in India · Phase 1", note: "Manual and algorithmic trading rounds; Python signal-processing scripts improved profit by about 25%." },
    { name: "Boeing National Aeromodelling", result: "National competitor", note: "Payload-drop aircraft at 1.6× thrust-to-weight.", link: "aeromodelling" },
    { name: "Shaastra Aerial Robotics", result: "Round 2", note: "Designed and flew 2 fully autonomous drones in a one-week sprint, with a custom ArduPilot geofence." },
    { name: "Signal Quest", result: "Finalist · top 15", note: "From 200+ participants; built and tuned a low-noise signal-processing circuit in the finals." },
  ],

  skills: [
    { group: "Embedded systems & avionics", items: [["STM32", "abhyuday"], ["KiCad", "abhyuday"], ["4-layer PCB design", "abhyuday"], ["Embedded C", "abhyuday"], ["LoRa telemetry", "abhyuday"], ["Battery management", "abhyuday"], ["ANSYS HFSS", "abhyuday"], ["Arduino", "attitude"], ["ExpressLRS"], ["MAVLink"]] },
    { group: "UAVs, autonomy & vision", items: [["ArduPilot", "icarus"], ["YOLOv11", "icarus"], ["ROS2", "valkron"], ["PID guidance", "valkron"], ["Pixhawk"]] },
    { group: "Aerodynamics & simulation", items: [["Python aero models", "lat"], ["XFOIL", "valkron"], ["MATLAB", "attitude"], ["Simulink"], ["Ansys CFD"]] },
    { group: "CAD & manufacturing", items: [["Fusion 360", "aeromodelling"], ["CNC-machined balsa", "aeromodelling"], ["AutoCAD"]] },
    { group: "Programming & data", items: [["Python", "lat"], ["Statistical process monitoring", "dpca"], ["Monte Carlo methods", "pokerbots"], ["C++"], ["Git & GitHub"], ["LaTeX"]] },
  ],

  beyond: [
    { img: "tennis", title: "Tennis", note: "AITA-ranked, 6+ years competitive; top 10% at TopSpin Tennis Academy, Bangalore. Peak UTR 7+, 3+ UTR tournament wins, 4+ TNTA state-level match wins, Inter-Hostel Gold (2025)." },
    { img: "bball", title: "Basketball", note: "IIT Madras Schroeters Gold Medal (2026) after a 2025 semifinal; Bronze as Vice-Captain in the Inter-Department League." },
    { img: "uzhavu", title: "Uzhavu · Shaastra", note: "Shaastra’s sustainable-agriculture campaign: 4,000+ lives reached, ₹6L+ raised from 7+ sponsors, and a 5K awareness run with 500+ runners." },
    { img: null, title: "Tensors · JEE mentorship", note: "Ran a national JEE mock test with 1,500 registrations to fund preparation for underprivileged aspirants; wrote original JEE Advanced papers; partnered with 10+ schools reaching 300 students." },
  ],
};
