package com.example.k3beaconapp;

public class StudentProgram {
    private int ProgramId;
    private String ProgramName;

    public int getProgramId() {
        return ProgramId;
    }

    public String getProgramName() {
        return ProgramName;
    }

    public void setProgramId(int programId) {
        ProgramId = programId;
    }

    public void setProgramName(String programName) {
        ProgramName = programName;
    }


    public  StudentProgram(int programId,String programName)
    {
        this.ProgramId=programId;
        this.ProgramName=programName;

    }

    @Override
    public String toString() {
        return  this.ProgramName ;
    }
}

