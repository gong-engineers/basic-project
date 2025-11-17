import { item } from '@basic-project/shared-types';

export const convertCategory = (category: item.Category) => {
  switch (category) {
    case 'SOCCER':
      return {
        label: '축구',
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-700',
      };
    case 'BASEBALL':
      return {
        label: '야구',
        bgColor: 'bg-red-100',
        textColor: 'text-red-700',
      };
    case 'BASKETBALL':
      return {
        label: '농구',
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800',
      };
    case 'VOLLEYBALL':
      return {
        label: '배구',
        bgColor: 'bg-green-100',
        textColor: 'text-green-700',
      };
    default:
      return {
        label: '기타',
        bgColor: 'bg-gray-300',
        textColor: 'text-gray-800',
      };
  }
};
