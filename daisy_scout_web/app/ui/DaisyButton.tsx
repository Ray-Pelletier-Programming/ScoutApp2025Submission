'use client';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function DaisyButton({ children, ...rest }: ButtonProps) {
  return (
    <button
      {...rest}
      className="rounded-lg px-4 text-sm font-medium text-white bg-blue-500 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 aria-disabled:cursor-not-allowed aria-disabled:opacity-50 disabled:bg-red-600 disabled:text-white justify-center"
    >
      {children}
    </button>
  );
}
