export const site = {
  name: "Samuel Anes",
  email: "sanes@andrew.cmu.edu",
  url: "https://samuelanes.com",
  role: "CMU ECE Freshman · Looking for a Summer 2027 internship",
  interests:
    "Robotics, controls, systems, and software",
  proof:
    "On Carnegie Mellon Racing\u2019s driverless team I lead two systems: the regenerative braking strategy, and the Delaunay edge selection that turns perceived cone positions into the path the car follows. My rebuild of that selection removed the planner\u2019s mis-planned frames in replay and extended its usable lookahead by 54%. Before CMU I led FTC software for four seasons and shipped a real-time multiplayer game to 1,000+ users.",
  links: {
    resume: "/resume.pdf",
    email: "mailto:sanes@andrew.cmu.edu",
    github: "https://github.com/Heinoushare",
    gitlab: "https://gitlab.com/Heinoushare",
    linkedin: "https://www.linkedin.com/in/samuelanes",
    sabacc: "https://sabacc.samuelanes.com",
    sabaccOrg: "https://github.com/Sabacc-Organization/Sabacc-Org",
    sabaccSolo: "https://github.com/Heinoushare/Sabacc-Multiplayer",
    ftc2023: "https://gitlab.com/TDT2845/tdt-2023-centerstage",
    ftc2025: "https://gitlab.com/TDT2845/tdt-2025-decode",
    ftcVideo: "https://www.youtube.com/watch?v=J2ExGWOT0n8",
    ftcVideoEmbed: "https://www.youtube-nocookie.com/embed/J2ExGWOT0n8",
    samduino: "https://github.com/Heinoushare/SamDuino",
    timerV1Video: "https://youtu.be/m-bSZaWcbeI",
    timerV2Video: "https://youtu.be/LZfNnxXztLI",
  },
} as const;

export const coursework = [
  "Intro to Electrical and Computer Engineering",
  "Calculus in Three Dimensions",
  "Concepts of Mathematics",
] as const;

export const skills = {
  programming: [
    "Python",
    "Java",
    "C",
    "C++",
    "SQL",
    "JavaScript",
    "HTML",
    "CSS",
    "Svelte",
  ],
  tools: [
    "GitHub",
    "Claude Code",
    "ROS 2",
    "Verilog",
    "Linux",
    "Android Studio",
    "Onshape",
  ],
  hardware: [
    "Arduino",
    "3D Printers",
    "CNC Machines",
    "Multimeter",
    "Oscilloscope",
  ],
  extracurriculars: [
    "Eagle Scout",
    "FIRST Dean's List Semi-Finalist",
    "FCC Amateur Extra",
    "World Cube Association Competitor",
  ],
} as const;
