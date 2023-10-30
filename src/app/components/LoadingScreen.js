import Image from 'next/image';

export default function LoadingScreen() {
  return (
    <div className="loading">
      <Image src="/spinner.gif" alt="loading" width="80" height="80" />
    </div>
  );
}
