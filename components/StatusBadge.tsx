import React from 'react';
import { Status } from '../types';
import { STATUS_COLORS } from '../constants';

interface StatusBadgeProps {
  status: Status;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${STATUS_COLORS[status] || STATUS_COLORS[Status.Pending]}`}>
      {status}
    </span>
  );
};
