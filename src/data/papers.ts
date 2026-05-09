import type { Paper } from '../components/PapersGrid';

export const papers: Paper[] = [
  {
    slug: 'imav2023',
    title: '자율농기계를 위한 실시간 GNSS-INS 복합항법장치',
    authors: ['C. Lee', 'W. Lee', 'K. Kim'],
    venue: '한국농업기계학회 추계학술대회',
    year: 2025,
    type: 'conference',
    abstract: 
      '',
    tags: ['INS-GNSS Navigation', 'Agricultural Machinery']
    // pdfLink: 'https://www.imavs.org/papers/2023/26.pdf',
    // codeLink: 'https://github.com/tershire/vi-slam-legged',
    // projectLink: '/projects/tfp-slam-',
    // award: 'Best Paper Finalist',
    // image: '/images/projects/orb_odom_path_compare_all.png',
  },
  {
    slug: 'thesis',
    title: 'Autonomous Development of Spoken Language in an Artificial Agent based on Intrinsic Motivation',
    authors: ['Wonhee LEE'],
    venue: 'ISAE-SUPAERO',
    year: 2024,
    type: 'thesis',
    abstract: '',
    tags: [],
    pdfLink: 'https://drive.google.com/file/d/1AA_fLbJcYALVqL33Ewld0egKKVECrQu1/view?usp=drive_link',
    driveEmbedId: '1AA_fLbJcYALVqL33Ewld0egKKVECrQu1',
  },
  {
    slug: 'imav2023',
    title: 'Autonomous landing, obstacle avoidance and block recovery for a quadrotor drone',
    authors: ['M. Fei', 'A. M. Radu', 'W. Lee', 'M. L. Bayon', 'L. L. Ribeiro'],
    venue: 'IMAV',
    year: 2023,
    type: 'conference',
    abstract: 
      'This technical report presents our proposed solution to the IMAV 2023 Drone Competition. The competition suggests an autonomous block recovery mission using a quadcopter with obstacleavoidance capabilities.',
    tags: ['Drone', 'Competition', 'Computer Vision', 'Control'],
    pdfLink: 'https://www.imavs.org/papers/2023/26.pdf',
    // codeLink: 'https://github.com/tershire/vi-slam-legged',
    projectLink: '/projects/tfp-slam-',
    // award: 'Best Paper Finalist',
    // image: '/images/projects/orb_odom_path_compare_all.png',
  },
];
