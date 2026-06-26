import { Link } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

export function NotFoundPage() {
  return (
    <section className="flex flex-col items-center justify-center py-24 px-6 text-center">
      <span className="font-editorial text-8xl font-black text-coral/20 select-none">404</span>
      <h1 className="font-editorial text-3xl font-bold text-charcoal mt-4 mb-2">Page Not Found</h1>
      <p className="font-sans text-base text-charcoal-light mb-8">
        The lesson you're looking for doesn't exist in the syllabus.
      </p>
      <Link
        to={ROUTES.HOME}
        className="px-6 py-3 bg-coral text-paper hover:bg-coral-dark rounded-xl font-sans text-base font-bold uppercase tracking-wider shadow-sm transition-all duration-300"
      >
        Back to Home
      </Link>
    </section>
  );
}
