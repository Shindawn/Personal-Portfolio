import './OutdatedNotice.css';

const OutdatedNotice = () => {
  return (
    <div className="outdated-notice-card" role="status" aria-live="polite">
      <div className="outdated-notice-header">
        <span className="notice-dot" />
        <span className="notice-title">Portfolio Notice!</span>
      </div>
      <p className="notice-message">
        A new portfolio is live! ^^ Visit{' '}
        <a href="https://lescycaadlawon.tech" target="_blank" rel="noreferrer">
          lescycaadlawon.tech
        </a>
      </p>
    </div>
  );
};

export default OutdatedNotice;
