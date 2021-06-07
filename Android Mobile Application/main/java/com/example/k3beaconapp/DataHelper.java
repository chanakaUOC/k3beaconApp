package com.example.k3beaconapp;

import java.util.ArrayList;
import java.util.List;

public   class DataHelper {
/*
* Manage statics meta data
* */
    public static List<UserType> getUserType(){
        List<UserType> userTypeList =new ArrayList<UserType>();

        userTypeList.add(new UserType(1,"Student"));
        userTypeList.add(new UserType(2,"Staff"));
        userTypeList.add(new UserType(3,"Guest"));

        return  userTypeList;

    }
}
