package com.example.k3beaconapp;

public class Department {
    private int department_id;
    private String department_name;

    public int getDepartment_id() {
        return department_id;
    }

    @Override
    public String toString() {
        return department_name ;
    }

    public Department(int department_id, String department_name) {
        this.department_id = department_id;
        this.department_name = department_name;
    }
}
