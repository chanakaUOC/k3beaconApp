package com.example.k3beaconapp;

import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.app.NotificationCompat;
import androidx.core.app.TaskStackBuilder;

import android.Manifest;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.bluetooth.BluetoothAdapter;
import android.bluetooth.BluetoothManager;
import android.bluetooth.le.BluetoothLeScanner;
import android.bluetooth.le.ScanCallback;
import android.bluetooth.le.ScanRecord;
import android.bluetooth.le.ScanResult;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.android.volley.Request;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.JsonArrayRequest;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.neovisionaries.bluetooth.ble.advertising.ADPayloadParser;
import com.neovisionaries.bluetooth.ble.advertising.ADStructure;
import com.neovisionaries.bluetooth.ble.advertising.IBeacon;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.UUID;


public class MainActivity extends AppCompatActivity {

    /*Declartions of variables for notification channels */
    private final static int REQUEST_ENABLE_BT = 1;
    private static final int PERMISSION_REQUEST_COARSE_LOCATION = 1;

    /*Declartions of variables */

    BluetoothManager btManager;
    BluetoothAdapter btAdapter;
    BluetoothLeScanner btScanner;
    Button btnStartScan;
    Button btnStopScan;
    Button btnDownloadData;
    Button btnUserRegistration;
    Button btnEventRegistration;
    TextView tvViewData;
    TextView tvNotifications;

    /*Application based information */
    private SharedPreferences pref;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        pref = this.getSharedPreferences(getString(R.string.SharedPrefNameApp), Context.MODE_PRIVATE);

        btnStartScan = findViewById(R.id.btnStartScan);
        btnStopScan = findViewById(R.id.btnStopScan);
        btnDownloadData = findViewById((R.id.btnDownloadData));
        btnUserRegistration = findViewById(R.id.btnUserRegistration);
        btnEventRegistration=findViewById(R.id.btnEventRegistration);
        tvNotifications=findViewById(R.id.tvNotification);
        tvViewData = findViewById(R.id.tvViewData);


        btnEventRegistration.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                openEventRegistration();
            }
        });


        btnUserRegistration.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                openUserRegistration();
            }
        });


        btnStartScan.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                startScanning();
            }
        });


        btnStopScan.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                stopScanning();
            }
        });


        /*Bluetoth and location permission enabling */
        try {
            btManager = (BluetoothManager) getSystemService(Context.BLUETOOTH_SERVICE);
            btAdapter = btManager.getAdapter();
            btScanner = btAdapter.getBluetoothLeScanner();


            if (btAdapter != null && !btAdapter.isEnabled()) {
                Intent enableIntent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
                startActivityForResult(enableIntent, REQUEST_ENABLE_BT);
            }

            // Make sure we have access coarse location enabled, if not, prompt the user to enable it
            if (this.checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                final AlertDialog.Builder builder = new AlertDialog.Builder(this);
                builder.setTitle("This app needs location access");
                builder.setMessage("Please grant location access so this app can detect peripherals.");
                builder.setPositiveButton(android.R.string.ok, null);
                builder.setOnDismissListener(new DialogInterface.OnDismissListener() {
                    @Override
                    public void onDismiss(DialogInterface dialog) {
                        requestPermissions(new String[]{Manifest.permission.ACCESS_COARSE_LOCATION}, PERMISSION_REQUEST_COARSE_LOCATION);
                    }
                });
                builder.show();
            }
        } catch (Exception ex) {
            Log.i("LogTag", ex.getMessage());
        }
    }
    private void openEventRegistration() {
        Intent intent = new Intent(this, UserProfile.class);
        startActivity(intent);
    }


    // Device scan callback.
    private ScanCallback leScanCallback = new ScanCallback() {
        @Override
        public void onScanResult(int callbackType, ScanResult result) {
            KBeacon beaconData=new KBeacon(); // Create instance of the user defined class to store beacon data
            beaconData.device_name= result.getDevice().getName(); // Get the device name


            try {
                /*Filter received signals by device name to avoid undercard API executions for other identified signals */
                if ( beaconData.device_name != null &&  beaconData.device_name.substring(0, 5).equalsIgnoreCase("FSC_B")) {
                    byte[] scanRecord = result.getScanRecord().getBytes();// Get the byte structure
                    beaconData.RSSI = result.getRssi();                  //  Get the RSSI value
                    List<ADStructure> structures =
                            ADPayloadParser.getInstance().parse(scanRecord); // Get the datapacket structures using byte structure

                    // For each AD structure contained in the advertising packet.
                    for (ADStructure structure : structures) {
                        // If the ADStructure instance can be cast to IBeacon.
                        if (structure instanceof IBeacon) {
                            // An iBeacon was found.
                            IBeacon iBeacon = (IBeacon) structure;

                            UUID uuid = iBeacon.getUUID();
                            beaconData.tx_power = iBeacon.getPower();
                            beaconData.UUID=uuid.toString();

                            showNotification(beaconData,result);
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
                Toast.makeText(MainActivity.this, e.getMessage(), Toast.LENGTH_SHORT).show();
            }
        }
    };



    public void startScanning() {
        System.out.println("start scanning");
        AsyncTask.execute(new Runnable() {
            @Override
            public void run() {
                btScanner.startScan(leScanCallback);
            }
        });
    }


    public void stopScanning() {
        System.out.println("stopping scanning");
        AsyncTask.execute(new Runnable() {
            @Override
            public void run() {
                btScanner.stopScan(leScanCallback);
            }
        });
    }

    private void showNotification(Context context, String title, String message) {
        try {

            int NOTIFICATION_ID = 234;
            NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

            String CHANNEL_ID = "k3_beacon_application";
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                CharSequence name = "k3_beacon_app_chanel";
                String Description = "Notification chanel for K3 Beacon application";
                int importance = NotificationManager.IMPORTANCE_HIGH;
                NotificationChannel mChannel = new NotificationChannel(CHANNEL_ID, name, importance);
                mChannel.setDescription(Description);
                mChannel.enableLights(true);
                mChannel.setLightColor(Color.RED);
                mChannel.enableVibration(true);
                mChannel.setVibrationPattern(new long[]{100, 200, 300, 400, 500, 400, 300, 200, 400});
                mChannel.setShowBadge(false);
                notificationManager.createNotificationChannel(mChannel);
            }

            NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                    .setSmallIcon(R.mipmap.ic_launcher)
                    .setContentTitle(title)
                    .setContentText(message);

            Intent resultIntent = new Intent(context, MainActivity.class);
            TaskStackBuilder stackBuilder = TaskStackBuilder.create(context);
            stackBuilder.addParentStack(MainActivity.class);
            stackBuilder.addNextIntent(resultIntent);
            PendingIntent resultPendingIntent = stackBuilder.getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT);
            builder.setContentIntent(resultPendingIntent);
            notificationManager.notify(NOTIFICATION_ID, builder.build());

        } catch (Exception ex) {
            Log.i("LogTag", ex.getMessage());
        }
    }
/// create notificatios
    /*
    * Parameters
    * context : Current threan context
    * Notitifcation_id : Notification id for the notification
    * title : Title of the notification
    * message : Notification full text
    * */
    private void showNotification(Context context,int Notification_Id,String title, String message) {
        try {
            //Initiate notification manager
            NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            //Chanel Id for name
            String CHANNEL_ID = "k3_beacon_application";

            //Check Android versuib for compatibiloty
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                CharSequence name = "k3_beacon_app_chanel";
                String Description = "Notification chanel for K3 Beacon application";
                int importance = NotificationManager.IMPORTANCE_HIGH;
                NotificationChannel mChannel = new NotificationChannel(CHANNEL_ID, name, importance);
                mChannel.setDescription(Description);
                mChannel.enableLights(true);
                mChannel.setLightColor(Color.RED);
                mChannel.enableVibration(true);
                mChannel.setVibrationPattern(new long[]{100, 200, 300, 400, 500, 400, 300, 200, 400});
                mChannel.setShowBadge(false);
                notificationManager.createNotificationChannel(mChannel);
            }
            //Initialte notification builder
            NotificationCompat.Builder builder = new NotificationCompat.Builder(context, CHANNEL_ID)
                    .setSmallIcon(R.mipmap.ic_launcher)
                    .setContentTitle(title)
                    .setContentText(message);

            Intent resultIntent = new Intent(context, MainActivity.class);
            TaskStackBuilder stackBuilder = TaskStackBuilder.create(context);
            stackBuilder.addParentStack(MainActivity.class);
            stackBuilder.addNextIntent(resultIntent);
            PendingIntent resultPendingIntent = stackBuilder.getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT);
            builder.setContentIntent(resultPendingIntent);
            notificationManager.notify(Notification_Id, builder.build());

        } catch (Exception ex) {
            Log.i("LogTag", ex.getMessage());
        }
    }


    ///Read API

    private void showNotification(KBeacon kBeacon,ScanResult scanResult) {


        String url = getString(R.string.api_notification_config);
        String uniqueID = pref.getString(getString(R.string.MobileUniqId), "");

        JSONArray requestArray = new JSONArray();
        JSONObject object = new JSONObject();
        try {
            //input your API parameters
            object.put("device_name", kBeacon.device_name);
            object.put("device_address", kBeacon.device_address);
            object.put("beacon_id", kBeacon.device_name);
            object.put("rssi", kBeacon.RSSI);
            object.put("request_time", Calendar.getInstance().getTime());
            object.put("user_mac_address", uniqueID);
            object.put("scan_result",scanResult);


            requestArray.put(object);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        JsonArrayRequest request = new JsonArrayRequest(Request.Method.POST, url, requestArray, new Response.Listener<JSONArray>() {
            String message_from_server = "";
            String message_header = "";

            public void onResponse(JSONArray response) {
                try {
                    List<NotificationMessage> notificationMessages=new ArrayList<>();

                    for (int i = 0; i < response.length(); i++) {
                        JSONObject ResInfo = response.getJSONObject(i);
                        message_from_server = ResInfo.getString("beacon_message");
                        message_header = ResInfo.getString("description");
                     String nitificationMessage = message_from_server
                                + System.getProperty("line.separator")
                                + message_header;

                        showNotification(getApplicationContext(), "Beacon App - K3", nitificationMessage);
                        tvNotifications.append("Beacon App - K3" + "\n" + nitificationMessage + "\n");
                        Toast.makeText(MainActivity.this, nitificationMessage, Toast.LENGTH_SHORT).show();
                    }
                } catch (JSONException e) {
                    Toast.makeText(MainActivity.this, e.getMessage(), Toast.LENGTH_SHORT).show();
                    e.printStackTrace();
                }
            }
        }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                tvViewData.setText(error.getMessage());
                Toast.makeText(MainActivity.this, error.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
        MySingleton.getInstance(MainActivity.this).addToRequestQueue(request);
    }


    private void openUserRegistration() {
        Intent intent = new Intent(this, UserRegitration.class);
        startActivity(intent);
    }
}