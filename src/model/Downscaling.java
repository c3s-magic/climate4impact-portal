package model;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * @author c4m
 *
 */
public class Downscaling {


  int jobId, status, zone, sYear, eYear;
  String username, predictand, downscalingMethod, type, model, experiment, project, ensemble, sDate, eDate, date;
  
  public Downscaling(){}
  
  public Downscaling(JSONObject jsonObject){
    
    try {
      
      this.jobId = jsonObject.getInt("jobId");
      this.status = jsonObject.getInt("status");
      this.zone = jsonObject.getInt("zone");
      this.sDate = jsonObject.getString("sDate");
      this.eDate = jsonObject.getString("eDate");
      
      this.username = jsonObject.getString("username");
      this.predictand = jsonObject.getString("predictand");
      this.downscalingMethod = jsonObject.getString("downscalingMethod");
      this.type = jsonObject.getString("type");
      this.model = jsonObject.getString("model");
      this.experiment = jsonObject.getString("experiment");
      this.date = jsonObject.getString("date");
      this.project = jsonObject.getString("project");
      this.ensemble = jsonObject.getString("ensemble");
      
    } catch (JSONException e) {
      e.printStackTrace();
    }
  }
  
  public int getJobId() {
    return jobId;
  }
  public void setJobId(int jobId) {
    this.jobId = jobId;
  }
 
  public int getZone() {
    return zone;
  }

  public void setZone(int zone) {
    this.zone = zone;
  }

  public int getsYear() {
    return sYear;
  }
  public void setsYear(int sYear) {
    this.sYear = sYear;
  }
  public int geteYear() {
    return eYear;
  }
  public void seteYear(int eYear) {
    this.eYear = eYear;
  }
  public String getUsername() {
    return username;
  }
  public void setUsername(String username) {
    this.username = username;
  }
  public String getPredictand() {
    return predictand;
  }
  public void setPredictand(String predictand) {
    this.predictand = predictand;
  }
  public String getDownscalingMethod() {
    return downscalingMethod;
  }
  public void setDownscalingMethod(String downscalingMethod) {
    this.downscalingMethod = downscalingMethod;
  }
  public String getType() {
    return type;
  }
  public void setType(String type) {
    this.type = type;
  }
 
  public String getModel() {
    return model;
  }

  public void setModel(String model) {
    this.model = model;
  }

  public String getExperiment() {
    return experiment;
  }

  public void setExperiment(String experiment) {
    this.experiment = experiment;
  }

  public int getStatus() {
    return status;
  }
  public void setStatus(int status) {
    this.status = status;
  }
  public String getDate() {
    return date;
  }
  public void setDate(String date) {
    this.date = date;
  }

  public String getProject() {
    return project;
  }

  public void setProject(String project) {
    this.project = project;
  }

  public String getEnsemble() {
    return ensemble;
  }

  public void setEnsemble(String ensemble) {
    this.ensemble = ensemble;
  }

  public String getsDate() {
    return sDate;
  }

  public void setsDate(String sDate) {
    this.sDate = sDate;
  }

  public String geteDate() {
    return eDate;
  }

  public void seteDate(String eDate) {
    this.eDate = eDate;
  }
  
}
