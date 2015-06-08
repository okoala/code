<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Identifier</title>
	<style type="text/css">
		*,:after,:before {
		    -webkit-box-sizing: border-box;
		    box-sizing: border-box
		}

		body,html {
		    min-height: 100%
		}

		html {
		    -ms-text-size-adjust: 100%;
		    -webkit-text-size-adjust: 100%;
		    font-size: 10px
		}

		body {
		    margin: 0;
		    background: #fff;
		    font-family: "Segoe UI","Lucida Grande",Helvetica,Arial,"Microsoft YaHei",FreeSans,Arimo,"Droid Sans","wenquanyi micro hei","Hiragino Sans GB","Hiragino Sans GB W3",FontAwesome,sans-serif;
		    font-weight: 400;
		    color: #333;
		    font-size: 1.6rem;
		    padding: 20px;
		}


		.title {
			font-size: 1.3rem;
		}

		.version {
			font-size: 1rem;	
		}

		.list {
			display: -webkit-flex;
			display: flex;
			-webkit-flex-direction: row;
			flex-direction: row;
			width: 4000px;
		}

		.item {
			width: 152px;
			margin: 0 10px;
		}
	</style>
</head>
<body>
	{% for item in data%}
		<h3 id="{{item.name}}" class="title">{{item.name}} <span class="version">{{item.ver}}</span></h3>
		<div class="list">
			{% for ids in item.identifiers %}
			<div class="item">
				<h5>{{ loop.key }}</h5>
				<div>
				{% for id in ids %}
					<p>{{ id }}</p>
				{% endfor %}
				</div>
			</div>
			{% endfor %}
		</div>
		<hr>
	{% endfor %}
</body>
</html>