define(function(){
  // minimarkdown, borrowed from express/lib/util.js
  return function(str){
    var html = String(str)
      .replace(/(__|\*\*)(.*?)\1/g, '<strong>$2</strong>')
      .replace(/(_|\*)(.*?)\1/g, '<em>$2</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    console.log("converted str <"+str+"> to <"+html+">");
    return html;
  };
  
});