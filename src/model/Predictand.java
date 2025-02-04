package model;

import org.json.JSONException;
import org.json.JSONObject;


public class Predictand {

  private int zone;
  private String predictand;
  private String predictor;
  private String description;
  private String dataset;
  private String variable;
  private String variableType;
  private float startLat;
  private float startLon;
  private float endLat;
  private float endLon;
  private float resLat;
  private float resLon;
  
  private Predictand(PredictandBuilder builder){
      this.zone = builder.zone;
      this.predictand = builder.predictand;
      this.predictor = builder.predictor;
      this.description = builder.description;
      this.dataset = builder.dataset;
      this.variable = builder.variable;
      this.variableType = builder.variableType;
      this.startLat = builder.startLat;
      this.startLon = builder.startLon;
      this.endLat = builder.endLat;
      this.endLon = builder.endLon;
      this.resLat = builder.resLat;
      this.resLon = builder.resLon;
  }

  public static class PredictandBuilder {
    private int zone;
    private String predictand;
    private String predictor;
    private String description;
    private String dataset;
    private String variable;
    private String variableType;
    private float startLat;
    private float startLon;
    private float endLat;
    private float endLon;
    private float resLat;
    private float resLon;
      
      public PredictandBuilder(JSONObject jsonObject){
        try {
          this.zone = jsonObject.getInt("zone");
          this.predictand = jsonObject.getString("predictand");
          this.predictor = jsonObject.getString("predictor");
          this.description = jsonObject.getString("description");
          this.dataset = jsonObject.getString("dataset");
          this.variable = jsonObject.getString("variable");
          this.variableType = jsonObject.getString("variableType");
          this.startLat = Float.parseFloat(jsonObject.getString("startLat"));
          this.startLon = Float.parseFloat(jsonObject.getString("startLon"));
          this.endLat = Float.parseFloat(jsonObject.getString("endLat"));
          this.endLon = Float.parseFloat(jsonObject.getString("endLon"));
          this.resLat = Float.parseFloat(jsonObject.getString("resLat"));
          this.resLon = Float.parseFloat(jsonObject.getString("resLon"));
        } catch (JSONException e) {
          e.printStackTrace();
        }
      }
      
      public Predictand build(){
        return new Predictand(this);
      }   
  }

  public int getZone() {
    return zone;
  }

  public void setZone(int zone) {
    this.zone = zone;
  }

  public String getPredictand() {
    return predictand;
  }

  public void setPredictand(String predictand) {
    this.predictand = predictand;
  }

  public String getPredictor() {
    return predictor;
  }

  public void setPredictor(String predictor) {
    this.predictor = predictor;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getDataset() {
    return dataset;
  }

  public void setDataset(String dataset) {
    this.dataset = dataset;
  }

  public String getVariable() {
    return variable;
  }

  public void setVariable(String variable) {
    this.variable = variable;
  }

  public String getVariableType() {
    return variableType;
  }

  public void setVariableType(String variableType) {
    this.variableType = variableType;
  }

  public float getStartLat() {
    return startLat;
  }

  public void setStartLat(float startLat) {
    this.startLat = startLat;
  }

  public float getStartLon() {
    return startLon;
  }

  public void setStartLon(float startLon) {
    this.startLon = startLon;
  }

  public float getEndLat() {
    return endLat;
  }

  public void setEndLat(float endLat) {
    this.endLat = endLat;
  }

  public float getEndLon() {
    return endLon;
  }

  public void setEndLon(float endLon) {
    this.endLon = endLon;
  }

  public float getResLat() {
    return resLat;
  }

  public void setResLat(float resLat) {
    this.resLat = resLat;
  }

  public float getResLon() {
    return resLon;
  }

  public void setResLon(float resLon) {
    this.resLon = resLon;
  }
  
}

