import type { Project } from '../components/ProjectsGrid';

export const projects: Project[] = [
  {
    slug: 'tfp-slam',
    title: 'SLAM for AUVs',
    description:
      'developing a {stereo camera, IMU, DVL, sonar} SLAM as part of <Tech for People LAB>.',
    type: 'academic',
    startYear: 2026,
    endYear: null,
    tags: ['SLAM', 'Robotics', 'C++', 'ROS2', 'Computer Vision'],
    featured: true,
    link: '/projects/tfp-slam',
    codeLink: 'https://github.com/Tershire/AQUA-SLAM/tree/migration/ros2',
    image: '/images/projects/orb_odom_path_compare_all.png',
  },
  // {
  //   slug: 'neural-occupancy',
  //   title: 'Neural Occupancy Mapping',
  //   description:
  //     'Learning-based approach to real-time 3D occupancy grid mapping using implicit neural representations, enabling dynamic obstacle tracking at 30 Hz.',
  //   type: 'academic',
  //   startYear: 2022,
  //   endYear: 2023,
  //   tags: ['Neural Networks', 'NeRF', 'Python', 'PyTorch', 'Mapping'],
  //   link: '/projects/neural-occupancy',
  //   paperLink: 'https://arxiv.org/abs/2000.00000',
  // },
];
