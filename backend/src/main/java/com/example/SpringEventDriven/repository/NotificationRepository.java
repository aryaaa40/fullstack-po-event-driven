package com.example.SpringEventDriven.repository;

import com.example.SpringEventDriven.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("SELECT n FROM Notification n WHERE (n.recipientRole = :role OR n.recipientUsername = :username) ORDER BY n.timestamp DESC")
    List<Notification> findRelevantNotifications(@Param("role") String role, @Param("username") String username);
}
