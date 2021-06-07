package com.example.k3beaconapp;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
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
import org.w3c.dom.Text;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.UUID;

public class UserRegitration extends AppCompatActivity {

    private  Context context;


    Spinner spn_program,spn_user_type;
    TextView txtFirstName,txtLastName,txtId,lblRegistrationType;
    private SharedPreferences pref;
    Button btnUserRegistration;

    @Override
    protected void onCreate(Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_user_regitration);
        spn_program=(Spinner)findViewById(R.id.spn_program);
        spn_user_type=(Spinner)findViewById(R.id.spn_user_type);
        pref = this.getSharedPreferences(getString(R.string.SharedPrefNameApp), Context.MODE_PRIVATE);
        btnUserRegistration = findViewById(R.id.btnUserRegistration);
        txtFirstName=(TextView)findViewById(R.id.txtFirstName) ;
        txtLastName=(TextView)findViewById(R.id.txtLastName) ;
        txtId=(TextView)findViewById(R.id.txtId) ;
        lblRegistrationType=(TextView)findViewById(R.id.lblRegistrationType) ;
        context=getBaseContext();



        getUserDetails();
        setUserTypeData();




        btnUserRegistration.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
            registerMobileUser();
            }
        });

        spn_user_type.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                if(position==0){
                    lblRegistrationType.setText("Program");
                    getStudentProgramList();
                }else if(position==1){
                    lblRegistrationType.setText("Department");
                    getDepartmentList();
                }else{
                    lblRegistrationType.setText("Event");
                    txtId.setText("");
                    getEventList();
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });

    }

private  void setUserTypeData(){

  List<UserType> userTypeList= DataHelper.getUserType();
    ArrayAdapter<UserType> userTypeArrayAdapter = new ArrayAdapter<UserType>(getBaseContext(),
            android.R.layout.simple_spinner_item,userTypeList);

    userTypeArrayAdapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
// Apply the adapter to the spinner
    spn_user_type.setAdapter(userTypeArrayAdapter);

}
    private void registerMobileUser() {

        if( TextUtils.isEmpty(txtFirstName.getText())){
            txtFirstName.setError( "First name is required!" );
            return;
        }


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

            int user_type_id=((UserType) spn_user_type.getSelectedItem()).getUserTypeId();
            User user=new User();
            if( user_type_id==1) {
                user.RegisterdProgramme = ((StudentProgram) spn_program.getSelectedItem()).getProgramId();
            }else if (user_type_id==2){
                user.DepartmetId=((Department) spn_program.getSelectedItem()).getDepartment_id();
            }else{
                user.EventId = ((Event) spn_program.getSelectedItem()).getEvent_id();
            }




            user.UserType = ((UserType) spn_user_type.getSelectedItem()).getUserTypeId();;
            user.FirstName = txtFirstName.getText().toString();
            user.LastName = txtLastName.getText().toString();
            user.UserRegistrationId = txtId.getText().toString();
            user.DeviceUniqueId = uniqueID;
            String url = getString(R.string.api_user_registration);
            JSONArray requestArray = new JSONArray();
            JSONObject object = new JSONObject();
            try {
                //input your API parameters
                object.put("first_name", user.FirstName);
                object.put("last_name", user.LastName);
                object.put("user_type", user.UserType);
                object.put("program_id", user.RegisterdProgramme);
                object.put("login_id", user.UserRegistrationId);
                object.put("mac_address", user.DeviceUniqueId);
                object.put("event_id", user.EventId);
                object.put("department_id", user.DepartmetId);
                object.put("update_data", "1");
                object.put("request_time", Calendar.getInstance().getTime());
                requestArray.put(object);
            }catch (JSONException e) {
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

    private  void getStudentProgramList(){
        List<StudentProgram> studentProgramList=new ArrayList<>();
        String url;
        url = getString(R.string.api_program_list);

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
                  List<StudentProgram> studentProgramList=new ArrayList<>();
                    for (int i = 0; i < response.length(); i++) {
                        JSONObject ResInfo = response.getJSONObject(i);
                        studentProgramList.add(new StudentProgram( ResInfo.getInt("program_id"), ResInfo.getString("program_name")){});
                    }
                    ArrayAdapter<StudentProgram> adapter_prog = new ArrayAdapter<StudentProgram>(getBaseContext(),
                            android.R.layout.simple_spinner_item,studentProgramList);
// Specify the layout to use when the list of choices appears
                    adapter_prog.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
// Apply the adapter to the spinner
                    spn_program.setAdapter(adapter_prog);
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



    private  void getDepartmentList(){
        List<Department> studentDepartmentList=new ArrayList<>();
        String url = getString(R.string.api_deparment_list);

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
                    //  JSONObject ResInfo = response.getJSONObject(0);
                    List<Department> studentDepartmentList=new ArrayList<>();
                    for (int i = 0; i < response.length(); i++) {
                        JSONObject ResInfo = response.getJSONObject(i);
                        studentDepartmentList.add(new Department( ResInfo.getInt("department_id"), ResInfo.getString("department_name")){});
                    }

                    ArrayAdapter<Department> adapter_prog = new ArrayAdapter<Department>(getBaseContext(),
                            android.R.layout.simple_spinner_item,studentDepartmentList);

// Specify the layout to use when the list of choices appears
                    adapter_prog.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
// Apply the adapter to the spinner
                    spn_program.setAdapter(adapter_prog);


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
                    //  JSONObject ResInfo = response.getJSONObject(0);
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
                    spn_program.setAdapter(adapter_prog);
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
                        txtFirstName.setText(ResInfo.getString("first_name"));
                        txtLastName.setText(ResInfo.getString("last_name"));
                        spn_user_type.setSelection( ResInfo.getInt("user_type_id")-1);
                        txtId.setText(ResInfo.getString("login_id"));
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
}