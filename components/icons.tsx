import React from 'react'
import Link from "next/link";
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2h3.308l-7.227 8.26L23 22h-6.59l-5.146-6.72L5.41 22H2.1l7.73-8.835L1 2h6.59l4.662 6.117L18.244 2z" />
    </svg>
  );
}
const SocialIcons = () => {
  return (
    <div><footer className="mb-5 flex items-center justify-center gap-4">
      {/* X/Twitter */}
      <Link
        href="https://x.com/your_handle"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="X (Twitter)"
        className="hover:opacity-80 transition-opacity"
      >
        <XIcon className="w-6 h-6" />
      </Link>

      {/* Discord (custom SVG) */}
      <Link
        href="https://discord.gg/your_invite"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Discord"
        className="hover:opacity-80 transition-opacity"
      >
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20.317 4.369a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.078.037c-.211.375-.444.864-.608 1.25-1.843-.276-3.679-.276-5.486 0-.164-.404-.405-.875-.617-1.25a.076.076 0 00-.078-.037 19.736 19.736 0 00-4.885 1.515.07.07 0 00-.032.027C2.045 9.087 1.333 13.634 1.619 18.122a.08.08 0 00.031.055c2.052 1.507 4.045 2.422 5.992 3.027a.077.077 0 00.084-.027c.461-.635.874-1.304 1.226-2.005a.076.076 0 00-.041-.106 13.198 13.198 0 01-1.882-.9.077.077 0 01-.008-.126c.126-.093.252-.19.372-.29a.075.075 0 01.078-.01c3.927 1.8 8.18 1.8 12.062 0a.075.075 0 01.079.01c.12.1.246.197.372.29a.077.077 0 01-.007.126c-.6.34-1.224.64-1.883.9a.077.077 0 00-.04.107c.36.7.773 1.369 1.226 2.004a.077.077 0 00.084.028c1.95-.605 3.944-1.52 5.993-3.027a.077.077 0 00.031-.054c.5-7.033-1.19-11.548-4.168-13.726a.061.061 0 00-.032-.028zM8.02 15.55c-1.182 0-2.154-1.08-2.154-2.41 0-1.33.955-2.41 2.154-2.41 1.21 0 2.175 1.09 2.154 2.41 0 1.33-.955 2.41-2.154 2.41zm7.975 0c-1.182 0-2.154-1.08-2.154-2.41 0-1.33.955-2.41 2.154-2.41 1.21 0 2.175 1.09 2.154 2.41 0 1.33-.944 2.41-2.154 2.41z"></path>
        </svg>
      </Link>
    </footer></div>
  )
}

export default SocialIcons