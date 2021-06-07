package com.example.k3beaconapp;

import java.util.ArrayList;
import java.util.List;

public  class UserType{
  public int getUserTypeId() {
    return UserTypeId;
  }

  public   int UserTypeId;

  @Override
  public String toString() {
    return UserTypeName ;
  }

  public UserType(int userTypeId, String userTypeName) {
    UserTypeId = userTypeId;
    UserTypeName = userTypeName;
  }

  public   String UserTypeName;




}
