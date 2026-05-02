import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import WorkIcon from '@mui/icons-material/Work';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { NotificationItem } from '../api/notificationService';

interface Props {
  notification: NotificationItem;
  isRead: boolean;
  onClick: () => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'Placement': return <WorkIcon fontSize="small" />;
    case 'Result': return <AssessmentIcon fontSize="small" />;
    case 'Event': return <EventIcon fontSize="small" />;
    default: return <EventIcon fontSize="small" />;
  }
};

const getColor = (type: string): "primary" | "secondary" | "success" | "error" | "info" | "warning" | "default" => {
  switch (type) {
    case 'Placement': return 'success';
    case 'Result': return 'info';
    case 'Event': return 'warning';
    default: return 'default';
  }
};

export const NotificationCard = ({ notification, isRead, onClick }: Props) => {
  return (
    <Card 
      onClick={onClick}
      sx={{ 
        mb: 2, 
        cursor: 'pointer',
        transition: 'all 0.2s',
        opacity: isRead ? 0.6 : 1,
        borderLeft: isRead ? '4px solid transparent' : '4px solid #1976d2',
        boxShadow: isRead ? 1 : 3,
        '&:hover': {
          boxShadow: 4,
          transform: 'translateY(-2px)'
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Chip 
            icon={getIcon(notification.Type)} 
            label={notification.Type} 
            color={getColor(notification.Type)}
            size="small"
            variant={isRead ? "outlined" : "filled"}
          />
          <Typography variant="caption" color="text.secondary">
            {notification.Timestamp}
          </Typography>
        </Box>
        <Typography variant="body1" fontWeight={isRead ? 'normal' : 'bold'}>
          {notification.Message}
        </Typography>
      </CardContent>
    </Card>
  );
};
