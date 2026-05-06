import { Outlet } from 'react-router-dom';
import CoachSidebar from './CoachSidebar';
import './CoachLayout.css';

export default function CoachLayout() {
  return (
    <div className="coach-layout">
      <CoachSidebar />
      <main className="coach-main">
        <Outlet />
      </main>
    </div>
  );
}