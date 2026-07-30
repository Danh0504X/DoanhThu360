import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button.jsx';
import { Card } from '../components/ui/Card.jsx';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-bone-50 px-4">
      <Card padding="lg" className="w-full max-w-md text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-primary-600">404</p>
        <h1 className="mt-2 text-2xl font-bold text-bone-800">Không tìm thấy trang</h1>
        <p className="mt-3 text-sm leading-6 text-bone-500">
          Đường dẫn bạn truy cập không tồn tại hoặc đã được di chuyển.
        </p>
        <Button className="mt-6" fullWidth onClick={() => navigate('/dashboard')}>
          Về trang chủ
        </Button>
      </Card>
    </div>
  );
};
