<%@page import="tools.HTTPTools" import="impactservice.*"%>
<div class="topnav">
	<%
		String Home = "/impactportal/";
		String numProductsString = "-";
		try {
			int numProducts = LoginManager.getUser(request)
					.getShoppingCart().getNumFiles();
			if (numProducts != 0) {
				numProductsString = "" + numProducts;
			}
		} catch (Exception e) {
		}

		String queryString = request.getQueryString();

		String pageName = request.getServletPath();
		if (queryString != null) {
			if (!queryString.equals("null")) {
				pageName = pageName + "?" + queryString;
			}
		}

		String searchCommand = null;
		try {
			searchCommand = HTTPTools.getHTTPParam(request, "q");
		} catch (Exception e) {
		}
		
		//Detect if we found a searchstring
		String searchString = "";
		if (searchCommand != null) {
			try {
				if (searchCommand.indexOf("search/node/") == 0) {
					searchString = searchCommand.substring("search/node/"
							.length());
					tools.Debug.println(searchString);
				}
			} catch (Exception e) {
				searchString = "";
			}
		}

		boolean highLightHome = false;
		boolean highLightData = false;
		boolean highLightDocumentation = false;
		boolean highLightHelp = false;
		boolean highLightFeedback = false;
		boolean highLightLogin = false;
		boolean highLightMapAndPlot = false;
		boolean highLightResources = false;
		boolean highLightAbout = false;
		boolean highLightDownscaling = false;

		if (pageName.indexOf("/data/") != -1)
			highLightData = true;
		else if (pageName.indexOf("index.jsp") != -1)
			highLightHome = true;
		else if (pageName.indexOf("documentation") != -1)
			highLightDocumentation = true;
		else if (pageName.indexOf("about.jsp") != -1)
			highLightAbout = true;
		else if (pageName.indexOf("help") != -1)
			highLightHelp = true;
		else if (pageName.indexOf("feedback.jsp") != -1)
			highLightFeedback = true;
		else if (pageName.indexOf("account") != -1)
			highLightLogin = true;
		else if (pageName.indexOf("consumer") != -1)
			highLightLogin = true;
		else if (pageName.indexOf("mapandplot.jsp") != -1)
			highLightMapAndPlot = true;
		else if (pageName.indexOf("resources.jsp") != -1)
			highLightResources = true;
		else if (pageName.indexOf("downscaling") != -1)
			highLightDownscaling = true;

		String currentLoginPage = null;
		currentLoginPage = (String) session
				.getAttribute("currentloginpage");

		if (currentLoginPage == null || currentLoginPage.equals("null"))
			currentLoginPage = "/account/login.jsp";

		//Login page cannot handle search request, so redirect to a page which can.
		if (highLightLogin || highLightData) {
			if (searchString != "") {

				String redirectURL = Home
						+ "documentation/backgroundandtopics.jsp?q="
						+ searchCommand;
				tools.Debug.println("redir to " + redirectURL);
				response.sendRedirect(redirectURL);

				out.println("<script type=\"text/javascript\">");
				out.println("window.location = '" + redirectURL + "'");
				out.println("</script>");

			}
		}

		ImpactUser user = null;
		try {
			user = LoginManager.getUser(request);
		} catch (Exception e) {

		}
	%>

</div>

<div class="impacttopmenu mainmenu">
	<ul>
	<li class="mainmenu-firstli"></li>
		<li <%if (highLightHome)
				out.print("class=\"sel\"");%>><a
			href="<%=Home%>general/index.jsp">Home</a></li>
		<li <%if (highLightData)
				out.print("class=\"sel\"");%>><a
			href="<%=Home%>data/index.jsp">Data discovery</a></li>
		<li <%if (highLightDownscaling)
				out.print("class=\"sel\"");%>><a
			href="<%=Home%>downscaling/downscalingdocs.jsp">Downscaling</a></li>
		<li <%if (highLightDocumentation)
				out.print("class=\"sel\"");%>><a
			href="<%=Home%>documentation/guidanceandusecases.jsp">Documentation</a></li>
		<li <%if (highLightHelp)
				out.print("class=\"sel\"");%>><a
			href="<%=Home%>help/index.jsp">Help</a></li>
		<li <%if (highLightAbout)
				out.print("class=\"sel\"");%>><a
			href="<%=Home%>general/about.jsp">About us</a></li>

		<!-- LOGIN  -->
		<li <%if (highLightLogin)
				out.print("class=\"c4i-mainmenu-login-tab sel\"");
		else		out.print("class=\"c4i-mainmenu-login-tab\"");
				%>>
			<%
				if (user != null) {
					String accountTitle = "Account";
					if (currentLoginPage.indexOf("jobs") != -1) {
						accountTitle += "&nbsp;<code class=\"codejobsicon\"></code>";
					}
					if (currentLoginPage.indexOf("processing") != -1) {
						accountTitle += "&nbsp;<code class=\"codejobsicon\"></code>";
					}
					if (currentLoginPage.indexOf("wpsuseproc") != -1) {
						accountTitle += "&nbsp;<code class=\"codejobsicon\"></code>";
					}
					if (currentLoginPage.indexOf("basket") != -1) {
						accountTitle += "&nbsp;<code class=\"codeshoppingcarticon\"></code>";
					}
					if (currentLoginPage.indexOf("login") != -1) {
						accountTitle += "&nbsp;<code class=\"codeusersicon\"></code>";
					}

					out.println("<a href=\""
							+ HTTPTools.makeCleanURL(Home + currentLoginPage)
							+ "\">" + accountTitle + "</a>");
				} else {
					out.print("<a href=\"" + Home
							+ "account/login.jsp\">Sign in</a>");
				}
			%>
		</li>

		<%
			if (user != null) {
				//out.println("<li><a href=\""+Home+"account/basket.jsp\"><code id='baskettext1' class=\"codeshoppingcarticon\">("+numProductsString+")</code></a></li>");
				//out.println("<li><a href=\""+Home+"account/jobs.jsp\"><code id='jobtext1' style=\"padding-left:20px;background-image:url('"+Home+"images/calculator-icon-16x16.png');background-repeat:no-repeat;\"></code></a></li>");
			}
		%>

	</ul>
	<span class="searchbox"><input id="searchbox" class="searchbox"
		type="text" size="16" value="<%=searchString%>"
		onkeypress="startSearchKeyPressed(event,this.form)" /></span>
</div>

<!-- &#160;</p> 
  </div> -->