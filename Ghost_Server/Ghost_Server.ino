#include <ESP8266WiFi.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include "FS.h"
#include <stdlib.h>
#include <Servo.h>

Servo servo;

const byte DNS_PORT = 53;
IPAddress apIP(192, 168, 1, 1);
DNSServer dnsServer;
ESP8266WebServer server(80);

uint32_t fanCountdown = 0;
uint8_t fanOpenState = 0; //closed

void serveMain() {
  File root = SPIFFS.open("/main.html", "r");
  if (!root) {
    Serial.println("Failed to open main");
    return;
  }
  size_t sent = server.streamFile(root, "text/html");
  root.close();
}

void fanOn() {
  digitalWrite(5, HIGH); 
  server.send(200, "text/html", "okay");
}

void fanOff() {
  digitalWrite(5, LOW);
  server.send(200, "text/html", "okay");
}

void fanOpen() {
  if (fanOpenState == 0) {
    fanOpenState = 1;
    fanCountdown = millis() + 500;
    servo.write(90);    
  } else {
    fanCountdown += 1000;
  }
  server.send(200, "text/html", "okay");
}

void fanClose() {
  fanOpenState = 0;
  servo.write(0);
}

void handleNotFound(){
  server.send(404, "text/html", "<h1>Error 404</h1><p><h2>What did you think you would find?</h2></p>");
}


void setup(void){
  Serial.begin(115200);

  servo.attach(2);
  pinMode(5, OUTPUT); //D1 on the module :(

//////////////////////wifi setup
//  WiFi.mode(WIFI_AP);
//  WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
//  WiFi.softAP("POV WIFI");
//
//  // modify TTL associated  with the domain name (in seconds)
//  // default is 60 seconds
//  dnsServer.setTTL(300);
//  // set which return code will be used for all other domains (e.g. sending
//  // ServerFailure instead of NonExistentDomain will reduce number of queries
//  // sent by clients)
//  // default is DNSReplyCode::NonExistentDomain
//  dnsServer.setErrorReplyCode(DNSReplyCode::ServerFailure);
//
//  // start DNS server for a specific domain name
//  dnsServer.start(DNS_PORT, "www.pov.com", apIP);
  const char* ssid = "HOME-E2C2";
  const char* password = "32F935F57DFDB323";
  WiFi.begin(ssid, password);

  IPAddress ip(10, 0, 0, 28); // where xx is the desired IP Address
  IPAddress gateway(10, 0, 0, 1); // set gateway to match your network
  //Serial.print(F("Setting static ip to : "));
  Serial.println(ip);
  IPAddress subnet(255, 255, 255, 0); // set subnet mask to match your network
  WiFi.config(ip, gateway, subnet);

  // Wait for connection
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("");
  Serial.print("Connected to ");
  Serial.println(ssid);
  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  
  server.on("/", serveMain);
  server.on("/fanOn", fanOn);
  server.on("/fanOff", fanOff);
  server.on("/fanOpen", fanOpen);    

  server.onNotFound(handleNotFound);

  server.begin();
  Serial.println("HTTP server started");

  
  Serial.println("Beginning SPIFFS");
  if (!SPIFFS.begin()) {
    Serial.println("Failed to mount file system");
  }


}

void loop(void){
  //dnsServer.processNextRequest();
  server.handleClient();

  if (fanOpenState == 1) {
    if (millis() >= fanCountdown) {
      fanClose();
    }
  }
    
  delay(1); 
}
