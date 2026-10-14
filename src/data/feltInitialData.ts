import {
  FeltHighlighterPath,
  FeltTriageMarker,
  FeltStickyNote,
  FeltCollaborator,
} from '../types/setu.ts';

export const INITIAL_FELT_NOTES: FeltStickyNote[] = [
  {
    id: 'note-syabru-01',
    lat: 28.162,
    lng: 28.162 < 30 ? 85.338 : 85.338, // 28.162, 85.338
    title: 'Syabrubesi Gorge Cut-off',
    content:
      '14 families isolated on eastern ridge. Bridge B-02 completely washed out by 3.8m surge. Cable crossing required for medical supply transfer.',
    author: 'Capt. P. Thapa',
    role: 'Nepal Army SAR Unit 4',
    avatarColor: '#f59e0b',
    timestamp: '18m ago',
    priority: 'Critical',
    resolved: false,
  },
  {
    id: 'note-dhunche-02',
    lat: 28.114,
    lng: 85.309,
    title: 'Dhunche Safe Heli-Drop LZ',
    content:
      'Football ground clear of debris and electrical wires. Validated for Mi-17 and Eurocopter AS350 landing. Elevation 1,980m ASL.',
    author: 'Dr. S. Karki',
    role: 'UN OCHA Field Coordinator',
    avatarColor: '#06b6d4',
    timestamp: '42m ago',
    priority: 'Info',
    resolved: true,
  },
  {
    id: 'note-ramche-03',
    lat: 28.079,
    lng: 85.274,
    title: 'Secondary Landslide Mud Dam',
    content:
      'Continuous rockfall along Pasang Lhamu Highway. Natural dam holding back approx 45,000m³ of slurry. Risk of sudden breaching within 6 hrs.',
    author: 'A. Shrestha',
    role: 'NEOC Disaster Geologist',
    avatarColor: '#f43f5e',
    timestamp: '1h 10m ago',
    priority: 'Urgent',
    resolved: false,
  },
];

export const INITIAL_FELT_MARKERS: FeltTriageMarker[] = [
  {
    id: 'marker-heli-1',
    lat: 28.112,
    lng: 85.307,
    type: 'heli_lz',
    title: 'LZ-Alpha: Dhunche District HQ Pad',
    author: 'SAR Team',
    timestamp: '08:45 NPT',
    color: '#10b981',
  },
  {
    id: 'marker-bridge-washout',
    lat: 28.156,
    lng: 85.335,
    type: 'bridge_out',
    title: 'B-02 Trishuli Suspension Span Severed',
    author: 'Roads Dept',
    timestamp: '09:15 NPT',
    color: '#f43f5e',
  },
  {
    id: 'marker-med-aid',
    lat: 28.201,
    lng: 85.358,
    type: 'medical',
    title: 'Emergency Triage Post (Tholu Syabru)',
    author: 'Red Cross',
    timestamp: '10:02 NPT',
    color: '#06b6d4',
  },
  {
    id: 'marker-ration-drop',
    lat: 28.228,
    lng: 85.366,
    type: 'ration_drop',
    title: 'Airdrop Zone: High Valley Pasture',
    author: 'WFP Logistics',
    timestamp: '10:20 NPT',
    color: '#f59e0b',
  },
];

export const INITIAL_FELT_PATHS: FeltHighlighterPath[] = [
  {
    id: 'path-evac-corridor',
    author: 'NEOC Flight Ops',
    color: '#06b6d4',
    width: 5,
    opacity: 0.85,
    label: 'Primary Heli Evac Air Corridor (Trishuli Valley)',
    points: [
      [85.185, 27.978],
      [85.245, 28.03],
      [85.278, 28.082],
      [85.305, 28.11],
      [85.334, 28.158],
    ],
  },
  {
    id: 'path-debris-surge',
    author: 'Sentinel Radar Team',
    color: '#f97316',
    width: 8,
    opacity: 0.65,
    label: 'Glacial Slurry Debris Surge Vector (6.2 m/s)',
    points: [
      [85.392, 28.295],
      [85.385, 28.272],
      [85.378, 28.243],
      [85.368, 28.225],
      [85.356, 28.198],
    ],
  },
];

export const INITIAL_COLLABORATORS: FeltCollaborator[] = [
  {
    id: 'collab-1',
    name: 'Capt. Pema Thapa',
    agency: 'Nepal Army SAR 4',
    color: '#f59e0b',
    avatar: 'PT',
    pos: [85.336, 28.16],
    activeAction: 'Inspecting Syabrubesi Bridge B-02',
  },
  {
    id: 'collab-2',
    name: 'Dr. Sunita Karki',
    agency: 'UN OCHA GIS',
    color: '#06b6d4',
    avatar: 'SK',
    pos: [85.31, 28.115],
    activeAction: 'Validating Dhunche Heli LZ',
  },
  {
    id: 'collab-3',
    name: 'Anil Shrestha',
    agency: 'NEOC Control',
    color: '#10b981',
    avatar: 'AS',
    pos: [85.276, 28.08],
    activeAction: 'Monitoring Ramche Slurry Dam',
  },
];
