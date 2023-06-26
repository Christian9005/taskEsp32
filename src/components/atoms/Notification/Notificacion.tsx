import React, { FC, useEffect } from 'react';
import './Notificacion.scss';

interface NotificationProps {
    message: string;
}

const Notification: FC<NotificationProps> = ({ message }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            // Ocultar la notificación después de 3 segundos
            hideNotification();
        }, 3000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    const hideNotification = () => {
        // Lógica para ocultar la notificación (puede ser mediante un estado)
    };

    return (
        <div className="notification">
            <span>{message}</span>
        </div>
    );
};

export default Notification;
