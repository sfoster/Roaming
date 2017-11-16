define(function() {
  'use strict';

  var playerSummary = {
    template: `<section>
    <img v-bind:src="icon" class="avatar"/>
    <h2>{{displayName}}</h2>
    <ul class="stats">
    <li><span>Level</span> <span>{{level}}</span></li>
    <li><span>Score</span> <span>{{score}}</span></li>
    </ul></section>`,
    props: { player: Object },
    computed: {
      "level": function() {
        return this.player.level;
      },
      "score": function() {
        return this.player.score;
      },
      "displayName": function() {
        return this.player.name;
      },
      "icon": function() {
        return this.player.icon;
      },
    },
  };
  return playerSummary;
});
