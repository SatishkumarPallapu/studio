import type { SVGProps } from 'react';

export const Icons = {
  logo: (props: SVGProps<SVGSVGElement>) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22c-5 0-9-4.5-9-10 0-2.5 1-5 2.5-6.5" />
      <path d="M16 2.5c2.5 2.5 4 6.5 4 10.5 0 2-1 4-2.5 5.5" />
      <path d="M2 12c0 5.5 4.5 10 10 10s10-4.5 10-10" />
      <path d="M12 2a10 10 0 0 0-8 4" />
      <path d="M18 6c-2.5 2.5-6.5 4-10.5 4" />
    </svg>
  ),
};
