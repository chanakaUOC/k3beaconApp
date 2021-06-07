package com.example.k3beaconapp;

public class Event {
    private  int event_id;

    public void setEvent_id(int event_id) {
        this.event_id = event_id;
    }

    public void setEvent_name(String event_name) {
        this.event_name = event_name;
    }

    public int getEvent_id() {
        return event_id;
    }

    public String getEvent_name() {
        return event_name;
    }

    private String event_name;

    public Event(int event_id, String event_name) {
        this.event_id = event_id;
        this.event_name = event_name;
    }

    @Override
    public String toString() {
        return event_name;
    }
}
