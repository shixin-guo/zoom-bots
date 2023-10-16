import { Button } from '@/components/ui/button';

export const StartButton: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}> = ({ onClick, disabled, loading }) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="my-2"
      variant="secondary"
    >
      {loading ? 'Translating...' : 'Start'}
    </Button>
  );
};
