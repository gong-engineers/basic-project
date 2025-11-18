import { useRouter } from 'next/navigation';
import { Toast, toast } from 'react-hot-toast';

interface Props {
  t: Toast;
}

function NeedLoginToast(props: Props) {
  const { t } = props;

  const router = useRouter();

  return (
    <div>
      <span>로그인이 필요합니다.</span>
      <button
        onClick={() => {
          router.push('/login');
          toast.dismiss(t.id);
        }}
        className="ml-2 border rounded-sm p-2 bg-gray-800 text-white font-semibold text-sm hover:bg-gray-900 transition-colors"
      >
        확인
      </button>
    </div>
  );
}

export default NeedLoginToast;
