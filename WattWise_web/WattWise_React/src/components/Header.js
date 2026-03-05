import React from 'react';
import { Zap, Moon, Sun, FileText } from 'lucide-react';

const Header = ({ theme, onThemeToggle, onGenerateReport }) => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <Zap className="logo-icon" size={32} />
          <h1>WattWise</h1>
          <p className="tagline">Smart IoT Energy Controller</p>
        </div>
        <div className="header-controls">
          <button
            className="btn btn-secondary"
            onClick={onGenerateReport}
            title="Generate PDF Report"
          >
            <FileText size={16} />
            PDF Report
          </button>
          <button
            className="theme-toggle"
            onClick={onThemeToggle}
            title="Toggle Dark/Light Mode"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;