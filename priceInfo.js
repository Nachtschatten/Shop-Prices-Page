(function(){var a,b,c,d,e,f,g,h;e=function(a,b,c){var d,e,f,g;d=.0373495858135303,e=.731944262776933,f=function(a){return Math.log(a+d/Math.pow(a,e))};if(a===0)return 0;a>0?g=f(b+a+.5)-f(b+.5):(g=f(b+.5)-f(b+a+.5),g*=1+c/100),g*=1e4;return Math.round(g)},g=function(a){var b,c,d,e,f,g,h,i;if(isNaN(a))return"";a=""+a;if(a.length<=3)return a;a[0]==="-"?(f="-",a=a.slice(1)):f="",e="",d=a.length;for(c=g=d-3,h=-(d%3)-1,i=-3;g<=h?c<=h:c>=h;c+=i)b=c,b<0&&(b=0),e=a.slice(b,d)+" "+e,d=b;return f+e.slice(0,-1)},f=null,c=function(b){var c,d,h,i,j,k,l,m,n,o,p;c=b.amount,p=b.tax||16,l=function(a,b,d){return"<div class="+a+">"+g(e(b,c,p))+"<br><span>"+g(e(d,c,p))+"</span></div>"},m=l("priceL",-1,-64),b.name==="Yellow flower"&&(b.picurl="http://www.minecraftwiki.net/images/4/49/Grid_Dandelion.png"),b.picurl||(b.picurl="http://tools.michaelzinn.de/mc/shopadmin/itempics/unknown.png"),i="<div class=icon><img src='"+b.picurl+"' alt='"+b.name+"' title='"+b.name+"'></div>",n=l("priceR",1,64),k=function(a){var b,c;b=a.data("infobox"),c=a.position(),b.css("left",c.left+(a.width()-b.width())/2),b.css("top",c.top+a.height());return b.fadeIn("fast")},o=function(){var a,c;c=$(this),a=c.data("infobox"),a||(a=$("<div class=infobox>\n\t<h1>"+b.name+"</h1>\n\t<div class='siminfo toggle'>Click to simulate</div>\n\t<form class='sim toggle'>\n\t\t<label><input type=radio name=bs value='-' checked>Kaufen</label>\n\t\t<label><input type=radio name=bs value='+'>Verkaufen</label>\n\t\t<br>\n\t\t<input type=number value=0 min=0 max=1000>\n\t</form>\n\t<div class=price></div>\n</div>"),a.hide().data("product",c).appendTo(c.offsetParent()),$("form input",a).change(d),$("form",a).submit(function(a){return a.preventDefault()}),c.data("infobox",a));return k(c)},h=function(){var a;a=$(this);if(!a.data("pinned"))return a.data("infobox").fadeOut("fast")},j=function(){var a,b,c,d;f?f!==this?(a=f,j.apply(a),h.apply(a),f=this):f=null:f=this,d=$(this),c=!d.data("pinned"),d.data("pinned",c),b=d.data("infobox"),$(".toggle",b).toggle();return k(d)},d=function(){var b,c,d,f,h,i,j,k,m,n,o;c=$(this).closest("form"),m=c.parent().data("product"),j=$("input[type=number]",c),b=j.val(),i=$("input:radio:checked",c).val(),k=m.data("pdata"),i==="-"&&k.amount<b&&(b=k.amount,j.val(b));if(!+b)c.siblings(".siminfo").addClass("toggle"),c.siblings(".price").hide(),m.css("background-color","transparent"),(o=m.data("listitem"))!=null&&o.remove(),a();else{c.siblings(".siminfo").removeClass("toggle"),l=e(+(i+b),k.amount,k.tax),d=g(l),c.siblings(".price").show().text(d),m.css("background-color","yellow"),f=i==="-"?"buy":"sell",n=$("<tr><td>"+b+"</td><td>"+$("img",m).attr("title")+"</td><td>"+d+"</td></tr>").data("price",l),$("#shoppinglist ."+f).append(n),h=m.data("listitem"),h&&h.remove(),m.data("listitem",n);return a()}};return $("<div class=product>"+m+i+n+"</div>").data("pdata",{amount:c,tax:p}).hover(o,h).click(j)},a=function(){var a,b,c,d;b=function(a){var b,c;c=$("#shoppinglist ."+a),b=0,c.find("tr").not(":first").each(function(){return b+=$(this).data("price")}),c.next().text(g(b));return b},c=b("sell"),a=b("buy");if(c===0&&a===0)return $("#shoppinglist .list").hide();d=c-a,$("#shoppinglist .total").text(g(d));return $("#shoppinglist .list").show()},b=function(a,b,c){var e;e=d(b.name)-d(c.name);if(e===0)return a.indexOf(b)-a.indexOf(c);return e},d=function(a){var b;a=a.toLowerCase(),b=function(){var b,c,d;for(c=0,d=arguments.length;c<d;c++){b=arguments[c];if(a.indexOf(b)!==-1)return!0}return!1};if(b("sapling"))return 1;if(b("leaves","birch tree","redwood tree"))return 2;if(b("workbench","furnace","chest","dispenser")&&!b("plate"))return 3;if(b("jukebox","note block"))return 4;if(b("rail"))return 5;if(b("bucket"))return 6;if(b("music disc"))return 7;if(b("minecart"))return 8;if(b("leather"))return 15;if(b("wood")||a==="birch")return 20;if(b("sand"))return 25;if(b("stone")&&!b("redstone"))return 30;if(b("rack"))return 30;if(b("iron"))return 35;if(b("diamond"))return 40;if(b("gold"))return 45;return 0},h=function(a){return $("meta[name=viewport]").attr("content","width="+a)},$.getJSON("http://tools.michaelzinn.de/mc/shopadmin/price_json.php?callback=?",function(a){var d,f,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w;r=0,i=$();for(q in a){l=a[q],l.sort(function(a,c){return b(l,a,c)});for(t=0,v=l.length;t<v;t++){k=l[t],f=c(k),n=f.children(".priceL, .priceR"),i=i.add(n),$("#"+q).append(f);for(u=0,w=n.length;u<w;u++)j=n[u],j=$(j),j.width()>r&&(r=j.width())}}i.width(r),$(document).trigger("itemsloaded"),$("#amountspinner").change(function(){var a;a=$(this).val();if(!(isNaN(a)||a<2)){$(".amount2").text(a);return $(".product").not("#example").each(function(){var b;j=$(this),b=j.data("pdata"),$(".priceL span",j).text(g(e(-a,b.amount,b.tax)));return $(".priceR span",j).text(g(e(+a,b.amount,b.tax)))})}}).parent().submit(function(a){return a.preventDefault()}),p=function(){var a,b,c;a=$("#blocks, #items"),c=$(".product",a).outerWidth(!0),b=a.width();return{container:a,itemwdt:c,cwdt:b,row:Math.floor(b/c)}},d=function(){var a;a=p();return a.container.css("padding-left",(a.cwdt-a.row*a.itemwdt)/2)},d(),$(window).resize(d),s=$(window).width(),s<800&&(o=p(),o.row<3&&(m=0,s<300?m=2*o.itemwdt:m=3*o.itemwdt,$("body").css("min-width",m),o.container.css("padding-left",0),h(m)));return null})}).call(this)