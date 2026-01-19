
import { Question } from './types';

export const SEED_PLAYERS = [];

export const INITIAL_QUESTIONS: Question[] = [
  // CHẶNG 1: ĐỒNG HỒ KIM
  {
    id: 's1q1',
    stageId: 1,
    type: 'clock-adjust',
    questionText: 'Bé hãy xoay đồng hồ đến 3 giờ 15 phút',
    hour: 3,
    minute: 15,
    correctAnswer: { hour: 3, minute: 15 },
    hint: 'Kim ngắn màu đỏ chỉ số 3, kim dài màu xanh dương chỉ số 3 bé nhé!'
  },
  {
    id: 's1q2',
    stageId: 1,
    type: 'clock-adjust',
    questionText: 'Bé hãy xoay đồng hồ đến 4 giờ 30 phút',
    hour: 4,
    minute: 30,
    correctAnswer: { hour: 4, minute: 30 },
    hint: 'Kim ngắn chỉ số 4, kim dài chỉ số 6 nha!'
  },
  {
    id: 's1q3',
    stageId: 1,
    type: 'select',
    questionText: 'Đồng hồ này chỉ mấy giờ?',
    hour: 7,
    minute: 15,
    options: ['7 giờ 15 phút', '7 giờ 30 phút', '8 giờ 15 phút'],
    correctAnswer: '7 giờ 15 phút',
    hint: 'Kim dài ở số 3 là 15 phút đó!'
  },
  {
    id: 's1q4',
    stageId: 1,
    type: 'select',
    questionText: 'Đồng hồ nào chỉ 6 giờ 30 phút?',
    hour: 6,
    minute: 30,
    options: [
      { hour: 6, minute: 30 },
      { hour: 6, minute: 15 },
      { hour: 12, minute: 30 }
    ],
    correctAnswer: 0,
    hint: 'Tìm đồng hồ có kim dài chỉ vào số 6 nào!'
  },
  {
    id: 's1q5',
    stageId: 1,
    type: 'select',
    questionText: 'Đồng hồ này là 2 giờ 15 phút hay 2 giờ 30 phút?',
    hour: 2,
    minute: 15,
    options: ['2 giờ 15 phút', '2 giờ 30 phút'],
    correctAnswer: '2 giờ 15 phút',
    hint: 'Kim dài đang ở số 3 đấy bé!'
  },

  // CHẶNG 2: ĐỒNG HỒ ĐIỆN TỬ
  {
    id: 's2q1',
    stageId: 2,
    type: 'select',
    questionText: 'Thẻ giờ đồng hồ điện tử: "07:15"',
    hour: 7,
    minute: 15,
    options: [
        { hour: 7, minute: 15 },
        { hour: 7, minute: 30 },
        { hour: 5, minute: 15 }
    ],
    correctAnswer: 0,
    hint: 'Chọn đồng hồ kim tương ứng với 07:15 nhé!'
  },
  {
    id: 's2q2',
    stageId: 2,
    type: 'select',
    questionText: 'Thẻ giờ đồng hồ điện tử: "09:30"',
    hour: 9,
    minute: 30,
    options: [
        { hour: 9, minute: 30 },
        { hour: 9, minute: 15 },
        { hour: 10, minute: 30 }
    ],
    correctAnswer: 0,
    hint: 'Nhìn số 30 ở cuối nhé!'
  },
  {
    id: 's2q3',
    stageId: 2,
    type: 'select',
    questionText: 'Thẻ giờ đồng hồ điện tử: "04:15"',
    hour: 4,
    minute: 15,
    options: [
        { hour: 4, minute: 15 },
        { hour: 4, minute: 30 },
        { hour: 1, minute: 15 }
    ],
    correctAnswer: 0,
    hint: 'Tìm đồng hồ kim chỉ 4 giờ 15 phút nào!'
  },
  {
    id: 's2q4',
    stageId: 2,
    type: 'select',
    questionText: 'Thẻ giờ đồng hồ điện tử: "06:30"',
    hour: 6,
    minute: 30,
    options: [
        { hour: 6, minute: 30 },
        { hour: 6, minute: 15 },
        { hour: 3, minute: 30 }
    ],
    correctAnswer: 0,
    hint: 'Tìm đồng hồ kim chỉ 6 giờ 30 phút nào!'
  },
  {
    id: 's2q5',
    stageId: 2,
    type: 'select',
    questionText: 'Thẻ giờ đồng hồ điện tử: "08:30"',
    hour: 8,
    minute: 30,
    options: [
        { hour: 8, minute: 30 },
        { hour: 8, minute: 15 },
        { hour: 10, minute: 30 }
    ],
    correctAnswer: 0,
    hint: 'Chọn đồng hồ kim 08:30 bé ơi!'
  },

  // CHẶNG 3: VẬN DỤNG (Nối dây)
  {
    id: 's3q1',
    stageId: 3,
    type: 'match',
    questionText: 'Bé hãy nối đồng hồ kim với đồng hồ số đúng nhé!',
    // Add missing hour and minute for TypeScript interface compliance
    hour: 12,
    minute: 0,
    // Cấu trúc cho bài tập nối dây (matching pairs)
    options: [
      { id: 'left1', type: 'analog', hour: 5, minute: 15, pairId: 'right1' },
      { id: 'left2', type: 'analog', hour: 10, minute: 30, pairId: 'right2' },
      { id: 'left3', type: 'analog', hour: 1, minute: 15, pairId: 'right3' },
      { id: 'right1', type: 'digital', text: '05:15', pairId: 'left1' },
      { id: 'right2', type: 'digital', text: '10:30', pairId: 'left2' },
      { id: 'right3', type: 'digital', text: '01:15', pairId: 'left3' },
    ],
    correctAnswer: 3, // Cần hoàn thành 3 cặp nối
    hint: 'Bé hãy nối từng cặp đồng hồ kim và số giống nhau nào!'
  },
  {
    id: 's3q2',
    stageId: 3,
    type: 'clock-adjust',
    questionText: 'Đồng hồ số là 10:30 – bé hãy xoay kim cho đúng',
    hour: 10,
    minute: 30,
    correctAnswer: { hour: 10, minute: 30 },
    hint: 'Xoay kim ngắn đến số 10 và kim dài đến số 6 nhé!'
  },
  {
    id: 's3q3',
    stageId: 3,
    type: 'select',
    questionText: 'Đồng hồ kim này chỉ mấy giờ?',
    hour: 11,
    minute: 30,
    options: ['11 giờ 30 phút', '11 giờ 15 phút', '12 giờ 30 phút'],
    correctAnswer: '11 giờ 30 phút',
    hint: 'Kim ngắn chỉ 11, kim dài chỉ 6!'
  },
  {
    id: 's3q4',
    stageId: 3,
    type: 'activity',
    questionText: '7 giờ 30 phút, bé thường làm gì?',
    hour: 7,
    minute: 30,
    imageUrl: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
    options: ['Ăn sáng và đi học', 'Đi ngủ'],
    correctAnswer: 'Ăn sáng và đi học',
    hint: 'Buổi sáng thức dậy chúng mình làm gì nhỉ?'
  },
  {
    id: 's3q5',
    stageId: 3,
    type: 'activity',
    questionText: '8 giờ 15 phút, bé đang chuẩn bị làm gì?',
    hour: 8,
    minute: 15,
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    options: ['Học bài cùng cô và bạn', 'Ăn tối'],
    correctAnswer: 'Học bài cùng cô và bạn',
    hint: 'Giờ này bé đang ở trong lớp học đấy!'
  }
];
