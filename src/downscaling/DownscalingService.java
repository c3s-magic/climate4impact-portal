package downscaling;

import impactservice.Configuration;
import impactservice.LoginManager;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Scanner;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import model.Downscaling;
import model.Job;
import model.Predictand;

import org.apache.commons.io.IOUtils;
import org.apache.http.HttpStatus;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import tools.Debug;


/**
 * Servlet implementation class ImpactService
 */
public class DownscalingService extends HttpServlet {
  
  /**
   * 
   */
  private static final long serialVersionUID = 1L;

  /**
   * @see HttpServlet#HttpServlet()
   */
  public DownscalingService() {
      super();
  }

  protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {  
    String pathInfo = request.getPathInfo();
    if(pathInfo.matches("/domains")){      
      HttpURLConnection urlConn = DownscalingAuth.prepareQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + pathInfo, "GET");
      BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
      StringBuilder sb = new StringBuilder();
      String inputLine;
      while ((inputLine = in.readLine()) != null) 
        sb.append(inputLine);
      in.close();
      response.setContentType("application/json");   
      PrintWriter out = response.getWriter();
      out.print(sb);
      out.flush();
    }else if(pathInfo.matches("/domains/.*")){
      HttpURLConnection urlConn = DownscalingAuth.prepareQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + pathInfo +  "?" + request.getQueryString(), "GET");
      BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
      StringBuilder sb = new StringBuilder();
      String inputLine;
      while ((inputLine = in.readLine()) != null) 
        sb.append(inputLine);
      in.close();
      response.setContentType("application/json");     
      PrintWriter out = response.getWriter(); 
      out.print(sb);
      out.flush();
    }else if(pathInfo.matches("/datasets")){      
        HttpURLConnection urlConn = DownscalingAuth.prepareQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + pathInfo, "GET");
        BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
        StringBuilder sb = new StringBuilder();
        String inputLine;
        while ((inputLine = in.readLine()) != null) 
          sb.append(inputLine);
        in.close();
        response.setContentType("application/json");   
        PrintWriter out = response.getWriter();
        out.print(sb);
        out.flush();
    }else if(pathInfo.matches("/predictands")){      
      HttpURLConnection urlConn = DownscalingAuth.prepareQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + pathInfo + "?" + request.getQueryString(), "GET");
      BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
      StringBuilder sb = new StringBuilder();
      String inputLine;
      while ((inputLine = in.readLine()) != null) 
        sb.append(inputLine);
      in.close();
      response.setContentType("application/json");   
      PrintWriter out = response.getWriter();
      out.print(sb);
      out.flush();
    
    }else if(pathInfo.matches("/zones/.*/predictands/.*")){
      HttpURLConnection urlConn = DownscalingAuth.prepareQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + pathInfo +  "?" + request.getQueryString(), "GET");
      BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
      StringBuilder sb = new StringBuilder();
      String inputLine;
      while ((inputLine = in.readLine()) != null) 
        sb.append(inputLine);
      in.close();
      response.setContentType("application/json");     
      PrintWriter out = response.getWriter(); 
      out.print(sb);
      out.flush();
      
    }else if(pathInfo.matches("/zones/.*/predictands/.*/downscalingMethods")){
      HttpURLConnection urlConn = DownscalingAuth.prepareQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + pathInfo + "?" + request.getQueryString(), "GET");
      BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
      StringBuilder sb = new StringBuilder();
      String inputLine;
      while ((inputLine = in.readLine()) != null) 
        sb.append(inputLine);
      in.close();
      response.setContentType("application/json");     
      PrintWriter out = response.getWriter();
      out.print(sb);
      out.flush();
      
    }else if(pathInfo.matches("/zones/.*/predictands/.*/stations")){
      HttpURLConnection urlConn = DownscalingAuth.prepareQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + pathInfo, "GET");
      BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
      StringBuilder sb = new StringBuilder();
      String inputLine;
      while ((inputLine = in.readLine()) != null) 
        sb.append(inputLine);
      in.close();
      response.setContentType("application/json");      
      PrintWriter out = response.getWriter();
      out.print(sb);
      out.flush();
    
    }else if(pathInfo.matches("/variables")){
      HttpURLConnection urlConn = DownscalingAuth.prepareQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + pathInfo + "?"+request.getQueryString(), "GET");
      BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
      StringBuilder sb = new StringBuilder();
      String inputLine;
      while ((inputLine = in.readLine()) != null) 
        sb.append(inputLine);
      in.close();
      response.setContentType("application/json");  
      PrintWriter out = response.getWriter();
      out.print(sb);
      out.flush();
      
    }else if(pathInfo.matches("/validation")){
      HttpURLConnection urlConn = DownscalingAuth.prepareSimpleQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + pathInfo + "?"+request.getQueryString(), "GET");
      OutputStream out = response.getOutputStream();
      InputStream in = urlConn.getInputStream();
      byte[] buffer = new byte[4096];
      int length;
      while ((length = in.read(buffer)) > 0){
          out.write(buffer, 0, length);
      }
      in.close();
      out.flush();
      response.setContentType("application/pdf");
      response.setHeader("Content-Disposition", "attachment; filename=validation.pdf");
      
    }else if(pathInfo.matches("/models")){
      HttpURLConnection urlConn = DownscalingAuth.prepareQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + pathInfo + "?" +request.getQueryString(), "GET");
      BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
      StringBuilder sb = new StringBuilder();
      String inputLine;
      while ((inputLine = in.readLine()) != null) 
        sb.append(inputLine);
      in.close();
      response.setContentType("application/json");    
      PrintWriter out = response.getWriter();
      out.print(sb);
      out.flush();
      
    }else if(pathInfo.matches("/models/.*")){
      HttpURLConnection urlConn = DownscalingAuth.prepareQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + pathInfo + "?" +request.getQueryString(), "GET");
      BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
      StringBuilder sb = new StringBuilder();
      String inputLine;
      while ((inputLine = in.readLine()) != null) 
        sb.append(inputLine);
      in.close();
      response.setContentType("application/json");    
      PrintWriter out = response.getWriter();
      out.print(sb);
      out.flush();
      
    }else if(pathInfo.matches("/models/.*/scenarios")){
      HttpURLConnection urlConn = DownscalingAuth.prepareQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + pathInfo + "?" +request.getQueryString(), "GET");
      BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
      StringBuilder sb = new StringBuilder();
      String inputLine;
      while ((inputLine = in.readLine()) != null) 
        sb.append(inputLine);
      in.close();
      response.setContentType("application/json");   
      PrintWriter out = response.getWriter();
      out.print(sb);
      out.flush();
      
    }else if(pathInfo.equals("/jobs")){
      HttpURLConnection urlConn = DownscalingAuth.prepareQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + pathInfo + "/users/" + request.getParameter("username") + "/jobs", "GET");
      BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
      StringBuilder sb = new StringBuilder();
      String inputLine;
      while ((inputLine = in.readLine()) != null) 
        sb.append(inputLine);
      in.close();
      response.setContentType("application/json");     
      PrintWriter out = response.getWriter();
      out.print(sb);
      out.flush();
      
    }else if(pathInfo.matches("/downscalings/download")){
      HttpURLConnection urlConn = DownscalingAuth.prepareSimpleQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + pathInfo +"?"+request.getQueryString(), "GET");
      OutputStream out = response.getOutputStream();
      InputStream in = urlConn.getInputStream();
      byte[] buffer = new byte[4096];
      int length;
      while ((length = in.read(buffer)) > 0){
          out.write(buffer, 0, length);
      }
      in.close();
      out.flush();
      response.setContentType("application/zip");
      response.setHeader("Content-Disposition", "attachment; filename=downscaling-"+request.getParameter("jobId")+".zip");
      
    }else if(pathInfo.matches("/downscalings/download4")){
      HttpURLConnection urlConn = DownscalingAuth.prepareSimpleQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + pathInfo +"?"+request.getQueryString(), "GET");
      File ncFile;
      try {
        ncFile = new File(LoginManager.getUser(LoginManager.getUserFromCookie(request)).getDataDir() + "/test.nc");
        OutputStream out = new FileOutputStream(ncFile);
        InputStream in = urlConn.getInputStream();
        byte[] buffer = new byte[4096];
        int length;
        while ((length = in.read(buffer)) > 0){
            out.write(buffer, 0, length);
        }
        IOUtils.closeQuietly(in);
        IOUtils.closeQuietly(out);
      } catch (Exception e) {
        e.printStackTrace();
      } 
    }else if(pathInfo.equals("/downscalings")){
      HttpURLConnection urlConn = DownscalingAuth.prepareSimpleQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + pathInfo +"?"+request.getQueryString(), "GET");
      BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
      StringBuilder sb = new StringBuilder();
      String inputLine;
      while ((inputLine = in.readLine()) != null) 
        sb.append(inputLine);
      in.close();
      response.setContentType("application/json");     
      PrintWriter out = response.getWriter();
      out.print(sb);
      out.flush();
    }else{
      response.setStatus(HttpStatus.SC_BAD_REQUEST);
    }
  }
    
  public static Map<String, String> getUserConfigurations(String username){
    try {
      Scanner scanner = null;
      Map<String, String> hashMap = new HashMap<String, String>();
      try {
        String userQueriesFilePath = Configuration.getImpactWorkspace().substring(0, Configuration.getImpactWorkspace().length()-1) + username + "/downscaling/queries";
        scanner = new Scanner(new File(userQueriesFilePath));

        while(scanner.hasNextLine()){
          String line = scanner.nextLine();
          String[] parts = line.split(",");
          hashMap.put(parts[0], parts[1]);
        }
      } catch (FileNotFoundException e) {
      }finally{
        scanner.close();
      }
      return hashMap;
    } catch (Exception e) {
    }
    return null;
  }

  public static List<Downscaling> getUserDownscalings(String username) throws JSONException, IOException{
    HttpURLConnection urlConn = DownscalingAuth.prepareQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + "/downscalings?username=" + username , "GET");
    if(urlConn.getResponseCode() == HttpURLConnection.HTTP_NOT_FOUND)
      return null;
    StringBuffer response = new StringBuffer();
    BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
    String inputLine;
    while ((inputLine = in.readLine()) != null) {
      response.append(inputLine);
    }
    in.close();
    JSONObject myObject = new JSONObject(response.toString());
    JSONArray jsonDownscalings = myObject.getJSONArray("values");
    List<Downscaling> downscalings = new ArrayList<Downscaling>();
    for(int i=0; i< jsonDownscalings.length(); i++){
      Downscaling d = new Downscaling(jsonDownscalings.getJSONObject(i));
      downscalings.add(d);
    }
    return downscalings;
  }
  
  public static List<Job> getUserJobs(String username) throws JSONException, IOException{
    HttpURLConnection urlConn = DownscalingAuth.prepareQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + "/jobs?username=" + username, "GET");
    if(urlConn.getResponseCode() == HttpURLConnection.HTTP_NOT_FOUND)
      return null;
    StringBuffer response = new StringBuffer();
    BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
    String inputLine;
    while ((inputLine = in.readLine()) != null) {
      response.append(inputLine);
    }
    in.close();
    JSONObject myObject = new JSONObject(response.toString());
    JSONArray jsonPredictands = myObject.getJSONArray("values");
    List<Job> jobs = new ArrayList<Job>();
    for(int i=0; i< jsonPredictands.length(); i++){
      Job p = new Job.JobBuilder(jsonPredictands.getJSONObject(i)).build();
      jobs.add(p);
    }
    return jobs;
  }
  
  public static List<Predictand> getUserPredictands(String username)throws ServletException, IOException, JSONException{
    HttpURLConnection urlConn = DownscalingAuth.prepareQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + "/users/" + username + "/predictands", "GET");
    if(urlConn.getResponseCode() == HttpURLConnection.HTTP_NOT_FOUND)
      return null;
    StringBuffer response = new StringBuffer();
    BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
    String inputLine;
    while ((inputLine = in.readLine()) != null) {
      response.append(inputLine);
    }
    in.close();
    JSONObject myObject = new JSONObject(response.toString());
    JSONArray jsonPredictands = myObject.getJSONArray("values");
    List<Predictand> predictands = new ArrayList<Predictand>();
    for(int i=0; i< jsonPredictands.length(); i++){
      Predictand p = new Predictand.PredictandBuilder(jsonPredictands.getJSONObject(i)).build();
      predictands.add(p);
    }
    return predictands;
  }
  
  public static List<String> getDomainTypes() throws IOException, JSONException{
//    HttpURLConnection urlConn = DownscalingAuth.prepareQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + "/domains/types", "GET");
//    if(urlConn.getResponseCode() == HttpURLConnection.HTTP_NOT_FOUND)
//      return null;
//    StringBuffer response = new StringBuffer();
//    BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
//    String inputLine;
//    while ((inputLine = in.readLine()) != null) {
//      response.append(inputLine);
//    }
//    in.close();
//    JSONObject myObject = new JSONObject(response.toString());
//    JSONArray jsonVariableTypes = myObject.getJSONArray("values");
    String[] domainTypes = {"VALUE"};
    List<String> domainTypesList = new ArrayList<String>();
    for(int i=0; i< domainTypes.length; i++){
      domainTypesList.add(domainTypes[i]);
    }
    return domainTypesList;
  }
  
  public static List<String> getDatasetTypes() throws IOException, JSONException{
//  HttpURLConnection urlConn = DownscalingAuth.prepareQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + "/domains/types", "GET");
//  if(urlConn.getResponseCode() == HttpURLConnection.HTTP_NOT_FOUND)
//    return null;
//  StringBuffer response = new StringBuffer();
//  BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
//  String inputLine;
//  while ((inputLine = in.readLine()) != null) {
//    response.append(inputLine);
//  }
//  in.close();
//  JSONObject myObject = new JSONObject(response.toString());
//  JSONArray jsonVariableTypes = myObject.getJSONArray("values");
  String[] domainTypes = {"Point","Grid"};
  List<String> domainTypesList = new ArrayList<String>();
  for(int i=0; i< domainTypes.length; i++){
    domainTypesList.add(domainTypes[i]);
  }
  return domainTypesList;
}
  
  public static List<String> getVariableTypes()throws ServletException, IOException, JSONException{
    HttpURLConnection urlConn = DownscalingAuth.prepareQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + "/variables/types", "GET");
    if(urlConn.getResponseCode() == HttpURLConnection.HTTP_NOT_FOUND)
      return null;
    StringBuffer response = new StringBuffer();
    BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
    String inputLine;
    while ((inputLine = in.readLine()) != null) {
      response.append(inputLine);
    }
    in.close();
    JSONObject myObject = new JSONObject(response.toString());
    JSONArray jsonVariableTypes = myObject.getJSONArray("values");
    List<String> variableTypes = new ArrayList<String>();
    for(int i=0; i< jsonVariableTypes.length(); i++){
      variableTypes.add(jsonVariableTypes.getString(i));
    }
    return variableTypes;
  }
  
  public static List<String> getModelTypes()throws ServletException, IOException, JSONException{
    HttpURLConnection urlConn = DownscalingAuth.prepareQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + "/models/types", "GET");
    if(urlConn.getResponseCode() == HttpURLConnection.HTTP_NOT_FOUND)
      return null;
    StringBuffer response = new StringBuffer();
    BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
    String inputLine;
    while ((inputLine = in.readLine()) != null) {
      response.append(inputLine);
    }
    in.close();
    JSONObject myObject = new JSONObject(response.toString());
    JSONArray jsonVariableTypes = myObject.getJSONArray("values");
    List<String> variableTypes = new ArrayList<String>();
    for(int i=0; i< jsonVariableTypes.length(); i++){
      variableTypes.add(jsonVariableTypes.getString(i));
    }
    return variableTypes;
  }
  
  public static List<String> getDownscalingMethodTypes()throws ServletException, IOException, JSONException{
    HttpURLConnection urlConn = DownscalingAuth.prepareQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + "/downscalingMethods/types", "GET");
    if(urlConn.getResponseCode() == HttpURLConnection.HTTP_NOT_FOUND)
      return null;
    StringBuffer response = new StringBuffer();
    BufferedReader in = new BufferedReader(new InputStreamReader(urlConn.getInputStream()));
    String inputLine;
    while ((inputLine = in.readLine()) != null) {
      response.append(inputLine);
    }
    in.close();
    JSONObject myObject = new JSONObject(response.toString());
    JSONArray jsonVariableTypes = myObject.getJSONArray("values");
    List<String> variableTypes = new ArrayList<String>();
    for(int i=0; i< jsonVariableTypes.length(); i++){
      variableTypes.add(jsonVariableTypes.getString(i));
    }
    return variableTypes;
  }


  /**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
	  String pathInfo = request.getPathInfo();
//	  ImpactUser loggedInUser = LoginManager.getUser(request);
    if(pathInfo.equals("/subscribe")){//Configuration.getImpactWorkspace()
      HttpURLConnection urlConn = DownscalingAuth.prepareQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + "/users", "POST");
      urlConn.setRequestProperty("Content-Type", "application/json");
      JSONObject user = new JSONObject();
      try {
        user.put("username", request.getParameter("username"));
        user.put("password", "");
        user.put("email", request.getParameter("email"));
        user.put("openID", request.getParameter("openID"));
      } catch (JSONException e) {
        e.printStackTrace();
      }
      OutputStreamWriter wr= new OutputStreamWriter(urlConn.getOutputStream());
      wr.write(user.toString());
      wr.flush();
      wr.close();
      if(urlConn.getResponseCode() ==HttpURLConnection.HTTP_CREATED){
          Debug.print("201 - User subscribed");  
          response.sendRedirect("../downscaling/create.jsp");
      }else{
          Debug.print("Subscription error - " + urlConn.getResponseMessage());
          response.sendRedirect("../downscaling/create.jsp?error=500");
      }  
      
    }else if(pathInfo.equals("/downscalings/downscale")){
      HttpURLConnection urlConn = DownscalingAuth.prepareQuery(Configuration.DownscalingConfig.getDpBaseRestUrl() + "/downscale" + "?" +request.getQueryString(), "POST");
      response.getWriter().print(urlConn.getResponseMessage());
      response.setStatus(urlConn.getResponseCode());
      
    }else if(pathInfo.equals("/config")){
      
      Map<String, String[]> parameterMap = request.getParameterMap();
      String username = parameterMap.get("username")[0];
      String configName = parameterMap.get("configName")[0]; 
      String userWorkspacePath = Configuration.getImpactWorkspace().substring(0, Configuration.getImpactWorkspace().length()-1) + username + "/downscaling";
      if(!hasConfig(username, configName)){
        File downscalingDirectory = new File(userWorkspacePath);
        if(!downscalingDirectory.exists())
          downscalingDirectory.mkdir();
        userWorkspacePath += "/queries";
        String query =  configName + ",";
        for(String key : parameterMap.keySet()){
          if(!key.equals("username") && !key.equals("configName"))
            query += key+"="+parameterMap.get(key)[0] + "&";
        }
        query = query.substring(0, query.length()-1);
        FileWriter file = null;
        PrintWriter pw = null;
        try
        {
          file = new FileWriter(userWorkspacePath, true);
          pw = new PrintWriter(file);
          pw.println(query);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
           try {
             if (null != file)
                file.close();
             } catch (Exception e2) {
                e2.printStackTrace();
             }
        }
      }else{
        response.getWriter().print("{'errors':['Existing name'],'success':false}");
        response.setStatus(403);
      }
      
    }else{
      response.setStatus(HttpStatus.SC_BAD_REQUEST);
    }
	}
	
	private boolean hasConfig(String username, String configName){
	  Map<String, String> userConfigsMap = getUserConfigurations(username);
	  if(userConfigsMap != null)
	    return userConfigsMap.containsKey(configName);
	  return false;
	}
}

