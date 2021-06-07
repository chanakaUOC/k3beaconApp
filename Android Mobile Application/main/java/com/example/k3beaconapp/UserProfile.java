package com.example.k3beaconapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.UUID;


/*
* User details
* User can registered for events
* Do not allow to edit user details in this screen
* */
public class UserProfile extends AppCompatActivity {
    private SharedPreferences pref;
    private Context context;
    private Spinner spn_event;
    private Button btnEventRegistration;

    TextView lblRegistrationType,lblUserType,lblId,lblFirstName,lblLastName;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_profile);
        context=getBaseContext();

        pref = this.getSharedPreferences(getString(R.string.SharedPrefNameApp), Context.MODE_PRIVATE);

        lblFirstName=(TextView)findViewById(R.id.lblFirstName);
        lblLastName=(TextView)findViewById(R.id.lblLastName);
        lblUserType=(TextView)findViewById(R.id.lblUserType);
        lblRegistrationType=(TextView)findViewById(R.id.lblRegistrationType);
        lblId=(TextView)findViewById(R.id.lblId);

        spn_event=(Spinner)findViewById(R.id.spn_event);
        btnEventRegistration=(Button)findViewById(R.id.btnEventRegistration);

        getUserDetails();
        getEventList();


        btnEventRegistration.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                registerMobileUserEvent();
            }
        });

    }



    private  void getUserDetails(){

        String uniqueID = "";
        if (pref.getString(getString(R.string.MobileUniqId), "").length() != 0) {
            uniqueID = pref.getString(getString(R.string.MobileUniqId), "");
        }else{

            return;
        }
        String url = getString(R.string.api_user_details);

        JSONArray requestArray = new JSONArray();
        JSONObject object = new JSONObject();

        try {
            object.put("device_id", uniqueID);

            requestArray.put(object);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        JsonArrayRequest request = new JsonArrayRequest(Request.Method.POST, url, requestArray, new Response.Listener<JSONArray>() {
            String message_from_server = "";
            String status = "";
            public void onResponse(JSONArray response) {
                try {
                    for (int i = 0; i < response.length(); i++) {
                        JSONObject ResInfo = response.getJSONObject(i);
                        lblFirstName.setText(ResInfo.getString("first_name"));
                        lblLastName.setText(ResInfo.getString("last_name"));
                        lblUserType.setText(ResInfo.getString("user_type"));
                        lblRegistrationType.setText(ResInfo.getString("registration_type"));
                        lblId.setText(ResInfo.getString("login_id"));
                    }

                } catch (JSONException e) {
                    Toast.makeText(context, e.getMessage(), Toast.LENGTH_SHORT).show();
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Log.e("String", error.getMessage());
            }
        });
        MySingleton.getInstance(context).addToRequestQueue(request);
    }


    private  void getEventList(){
        List<StudentProgram> studentProgramList=new ArrayList<>();
        String url = getString(R.string.api_event_list);

        JSONArray requestArray = new JSONArray();
        JSONObject object = new JSONObject();

        try {
            object.put("user_id", "1");
            requestArray.put(object);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        JsonArrayRequest request = new JsonArrayRequest(Request.Method.POST, url, requestArray, new Response.Listener<JSONArray>() {
            String message_from_server = "";
            String status = "";
            public void onResponse(JSONArray response) {
                try {
                   List<Event> studentProgramList=new ArrayList<>();
                    for (int i = 0; i < response.length(); i++) {
                        JSONObject ResInfo = response.getJSONObject(i);
                        studentProgramList.add(new Event( ResInfo.getInt("event_id"), ResInfo.getString("event_name")){});
                    }

                    ArrayAdapter<Event> adapter_prog = new ArrayAdapter<Event>(getBaseContext(),
                            android.R.layout.simple_spinner_item,studentProgramList);
// Specify the layout to use when the list of choices appears
                    adapter_prog.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
// Apply the adapter to the spinner
                    spn_event.setAdapter(adapter_prog);

                } catch (JSONException e) {
                    Toast.makeText(context, e.getMessage(), Toast.LENGTH_SHORT).show();
                    e.printStackTrace();
                }
                String nitificationMessage = message_from_server
                        + System.getProperty("line.separator")
                        + status;

                Toast.makeText(context, nitificationMessage, Toast.LENGTH_SHORT).show();
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                Toast.makeText(context, error.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
        MySingleton.getInstance(context).addToRequestQueue(request);
    }



    private void registerMobileUserEvent() {

        try {
            String uniqueID = "";
            if (pref.getString(getString(R.string.MobileUniqId), "").length() == 0) {
                SharedPreferences.Editor editor = pref.edit();
                uniqueID = UUID.randomUUID().toString();
                editor.putString(getString(R.string.MobileUniqId), uniqueID);
                editor.apply();
            } else {
                uniqueID = pref.getString(getString(R.string.MobileUniqId), "");
            }
            Student user = new Student();
            user.RegisterdProgramme =((Event) spn_event.getSelectedItem()).getEvent_id();
            user.DeviceUniqueId = uniqueID;
            String url = "http://134.209.101.133:3008/beacon-api/mb-user-management/register-event";

            JSONArray requestArray = new JSONArray();
            JSONObject object = new JSONObject();
            try {
                //input your API parameters
                //  "program_id": 1,         "department_id": 1,   "event_id": 1
                object.put("event_id", user.RegisterdProgramme);
                object.put("login_id", user.UserRegistrationId);
                object.put("mac_address", user.DeviceUniqueId);
                object.put("update_data", "0");
                object.put("request_time", Calendar.getInstance().getTime());
                requestArray.put(object);
            } catch (JSONException e) {
                e.printStackTrace();
            }

            JsonArrayRequest request = new JsonArrayRequest(Request.Method.POST, url, requestArray, new Response.Listener<JSONArray>() {

                String message_from_server = "";
                String status = "";

                public void onResponse(JSONArray response) {
                    try {
                        JSONObject ResInfo = response.getJSONObject(0);
                        message_from_server = ResInfo.getString("beacon_message");
                        status = ResInfo.getString("description");
                    } catch (JSONException e) {
                        Toast.makeText(context, e.getMessage(), Toast.LENGTH_SHORT).show();
                        e.printStackTrace();
                    }
                    String nitificationMessage = message_from_server
                            + System.getProperty("line.separator")
                            + status;
                    Toast.makeText(context, nitificationMessage, Toast.LENGTH_SHORT).show();
                }
            }, new Response.ErrorListener() {
                @Override
                public void onErrorResponse(VolleyError error) {
                    Toast.makeText(context, error.getMessage(), Toast.LENGTH_SHORT).show();
                }
            });
            MySingleton.getInstance(context).addToRequestQueue(request);

        } catch (Exception e) {
            Toast.makeText(context, e.getMessage(), Toast.LENGTH_SHORT).show();
        }
    }

}