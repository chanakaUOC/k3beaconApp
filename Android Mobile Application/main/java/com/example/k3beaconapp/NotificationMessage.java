package com.example.k3beaconapp;

public class NotificationMessage {

    private String messageHeader;
    private String messageBody;


    public NotificationMessage(String messageHeader,String messageBody){
        this.messageHeader = messageHeader;
        this.messageBody = messageBody;
    }

    public String getMessageHeader() {
        return messageHeader;
    }

    public void setMessageHeader(String messageHeader) {
        this.messageHeader = messageHeader;
    }

    public String getMessageBody() {
        return messageBody;
    }

    public void setMessageBody(String messageBody) {
        this.messageBody = messageBody;
    }
}
