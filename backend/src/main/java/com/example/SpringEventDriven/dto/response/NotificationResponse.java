package com.example.SpringEventDriven.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class NotificationResponse {
    private String id;
    private Long poId;
    private String newStatus;
    private String actorUsername;
    private String requesterUsername;
    private String timestamp;
    private boolean read;
}
