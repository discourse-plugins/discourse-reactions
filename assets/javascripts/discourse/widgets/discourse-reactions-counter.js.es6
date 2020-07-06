import { h } from "virtual-dom";
import { createWidget } from "discourse/widgets/widget";

export default createWidget("discourse-reactions-counter", {
  tagName: "div.discourse-reactions-counter",

  buildKey: attrs => `discourse-reactions-counter-${attrs.post.id}`,

  mouseOut() {
    if (!this.site.mobileView) {
      this.callWidgetFunction("scheduleCollapse");
    }
  },

  mouseOver(event) {
    if (!this.site.mobileView) {
      this.callWidgetFunction("cancelCollapse");
      this.callWidgetFunction("toggleStatePanel", event);
    }
  },

  click(event) {
    this.callWidgetFunction("toggleStatePanel", event);
  },

  html(attrs) {
    if (attrs.post.reaction_users_count) {
      const count = attrs.post.reaction_users_count;

      if (count <= 0) {
        return;
      }

      return h(
        "button.btn-flat.fade-out.btn-default.btn-reaction-counter",
        count.toString()
      );
    }
  }
});
