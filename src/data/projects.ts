import type { Project } from '../components/ProjectsGrid';

export const projects: Project[] = [
  {
    slug: 'visual-slam',
    title: 'Visual-Inertial SLAM for Legged Robots',
    description:
      'A tightly-coupled visual-inertial odometry system designed for quadruped robots operating in unstructured outdoor environments, achieving centimeter-level localization accuracy.',
    type: 'academic',
    startYear: 2023,
    endYear: null,
    tags: ['SLAM', 'Robotics', 'C++', 'ROS2', 'Computer Vision'],
    featured: true,
    link: '/projects/visual-slam',
    codeLink: 'https://github.com/tershire/visual-slam',
  },
  {
    slug: 'neural-occupancy',
    title: 'Neural Occupancy Mapping',
    description:
      'Learning-based approach to real-time 3D occupancy grid mapping using implicit neural representations, enabling dynamic obstacle tracking at 30 Hz.',
    type: 'academic',
    startYear: 2022,
    endYear: 2023,
    tags: ['Neural Networks', 'NeRF', 'Python', 'PyTorch', 'Mapping'],
    link: '/projects/neural-occupancy',
    paperLink: 'https://arxiv.org/abs/2000.00000',
  },
  {
    slug: 'autonomy-stack',
    title: 'Modular Autonomy Stack',
    description:
      'A composable autonomy framework for mobile robots, providing plug-and-play modules for perception, planning, and control. Used in 3+ lab platforms.',
    type: 'collaborative',
    startYear: 2021,
    endYear: 2024,
    tags: ['ROS2', 'Python', 'C++', 'Architecture', 'Open Source'],
    link: '/projects/autonomy-stack',
    codeLink: 'https://github.com/tershire/autonomy-stack',
  },
  {
    slug: 'terrain-classifier',
    title: 'Self-Supervised Terrain Classification',
    description:
      'Self-supervised learning from proprioceptive signals to classify terrain type (grass, gravel, mud) and predict traversability without labeled data.',
    type: 'academic',
    startYear: 2022,
    endYear: 2023,
    tags: ['Self-Supervised', 'Classification', 'PyTorch', 'Legged Robots'],
  },
  {
    slug: 'robo-grasping',
    title: 'Sim-to-Real Grasping',
    description:
      'Transferring a dexterous manipulation policy trained in simulation to a real robot arm using domain randomization and adaptive learning rate scheduling.',
    type: 'personal',
    startYear: 2020,
    endYear: 2021,
    tags: ['Reinforcement Learning', 'Sim-to-Real', 'PyBullet', 'Manipulation'],
    link: '/projects/robo-grasping',
  },
  {
    slug: 'micro-ros-tooling',
    title: 'micro-ROS Profiling Toolkit',
    description:
      'A lightweight profiling and visualization toolkit for micro-ROS nodes on embedded MCUs, exposing timing and memory budgets in real time.',
    type: 'open-source',
    startYear: 2021,
    endYear: 2022,
    tags: ['micro-ROS', 'Embedded', 'C', 'Tooling'],
    codeLink: 'https://github.com/tershire/micro-ros-profiler',
  },
  {
    slug: 'depth-completion',
    title: 'Sparse-to-Dense Depth Completion',
    description:
      'Completing sparse LiDAR depth maps with monocular camera guidance using a guided convolutional network architecture.',
    type: 'personal',
    startYear: 2019,
    endYear: 2020,
    tags: ['Depth Estimation', 'LiDAR', 'CNN', 'PyTorch'],
  },
];
