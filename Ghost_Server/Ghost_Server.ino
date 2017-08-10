#include <ESP8266WiFi.h>
#include <DNSServer.h>
#include <ESP8266WebServer.h>
#include "FS.h"
#include <stdlib.h>
#include <Servo.h>

Servo servo;

const byte DNS_PORT = 53;
const byte FAN = 5;
IPAddress apIP(192, 168, 1, 1);
DNSServer dnsServer;
ESP8266WebServer server(80);

const uint8_t servoOpen = 0;
const uint8_t servoClosed = 180;

uint32_t fanCloseCountdown = 0;
uint32_t fanOffCountdown = 0;
uint8_t fanOpenState = 0; //closed
uint8_t fanOffOnTimer = 0;

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
  digitalWrite(FAN, HIGH); 
  fanOffOnTimer = 0;
  server.send(200, "text/html", "okay");
}

void turnFanOff() {
  Serial.println("Fan off");
  digitalWrite(FAN, LOW);
}

void fanOff() {
  if (fanOpenState == 0) {
    turnFanOff();
  } else {
    fanOffOnTimer = 1;
    //hack to keep the fan from turning off immediately
    fanOffCountdown = fanCloseCountdown + 500;
  }
  server.send(200, "text/html", "okay");
}

void fanOpen() {
  if (fanOpenState == 0) {
    fanOpenState = 1;
    fanCloseCountdown = millis() + 500;
    servo.write(servoOpen);    
  } else {
    fanCloseCountdown += 500;
  }
  server.send(200, "text/html", "okay");
}

void fanClose() {
  fanOpenState = 0;
  servo.write(servoClosed);
  fanOffCountdown = millis() + 500;

}

void handleNotFound(){
  server.send(404, "text/html", "<h1>Error 404</h1><p><h2>Hi, nothing here.</h2></p>");
}


void setup(void){
  Serial.begin(115200);

  servo.attach(4);
  pinMode(FAN, OUTPUT); //D1 on the module :(
  
  servo.write(servoClosed);
  digitalWrite(FAN, LOW);
  
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
  const char* ssid = "Sonic-4251";
  const char* password = "4x8wwb45p43v";
  WiFi.begin(ssid, password);

  IPAddress ip(192, 168, 42, 80); // where xx is the desired IP Address
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
    if (millis() >= fanCloseCountdown) {
      fanClose();
    }
  }
  if (fanOffOnTimer == 1) {
    if (millis() >= fanOffCountdown) {
      turnFanOff();
      fanOffOnTimer = 0;
    }
  }    
  delay(1); 
}
