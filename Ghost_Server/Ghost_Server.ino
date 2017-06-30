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

uint16_t fanCountdown = 0;
uint8_t fanOpenState = 0; //closed

void sendTestResponse() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "okay");
}

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
  digitalWrite(3, HIGH); 
  Serial.println("fanOn");
  sendTestResponse();
}

void fanOff() {
  digitalWrite(3, LOW);
  Serial.println("fanOff");
  sendTestResponse();  
}

void fanOpen() {
  Serial.println("fanOpen");  
  if (fanOpenState == 0) {
    fanCountdown = millis() + 1000;
    servo.write(90);    
  } else {
    fanCountdown += 1000;
  }
  sendTestResponse();  
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
  pinMode(3, OUTPUT);

//////////////////////wifi setup
  WiFi.mode(WIFI_AP);
  WiFi.softAPConfig(apIP, apIP, IPAddress(255, 255, 255, 0));
  WiFi.softAP("POV WIFI");

  // modify TTL associated  with the domain name (in seconds)
  // default is 60 seconds
  dnsServer.setTTL(300);
  // set which return code will be used for all other domains (e.g. sending
  // ServerFailure instead of NonExistentDomain will reduce number of queries
  // sent by clients)
  // default is DNSReplyCode::NonExistentDomain
  dnsServer.setErrorReplyCode(DNSReplyCode::ServerFailure);

  // start DNS server for a specific domain name
  dnsServer.start(DNS_PORT, "www.pov.com", apIP);
  
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
  dnsServer.processNextRequest();
  server.handleClient();

  if (fanOpenState = 1) {
    if (millis() > fanCountdown) {
      fanClose();
    }
  }
    
  delay(1); 
}
