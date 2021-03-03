<ul>
  {{#items}}
    <li><a href="/news/{{_id}}">{{title}}</a></li>
  {{/items}}

  {{^items}}
    <span>Новини не знайдено :(</span>
  {{/items}}
</ul>