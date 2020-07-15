import RawHtml from "discourse/widgets/raw-html";
import { emojiUnescape } from "discourse/lib/text";
import { h } from "virtual-dom";
import { createWidget } from "discourse/widgets/widget";

export default createWidget("discourse-reactions-picker", {
  tagName: "div.discourse-reactions-picker",

  buildKey: attrs => `discourse-reactions-picker-${attrs.post.id}`,

  mouseOut() {
    if (!this.site.mobileView) {
      this.callWidgetFunction("scheduleCollapse");
    }
  },

  mouseOver() {
    if (!this.site.mobileView) {
      this.callWidgetFunction("cancelCollapse");
    }
  },

  html(attrs) {
    if (attrs.reactionsPickerExpanded) {
      return [
        h(
          "div.container",
          attrs.post.topic.valid_reactions.map(reaction => {
            let isUsed;
            let canUndo;
            if (reaction === this.siteSettings.discourse_reactions_like_icon) {
              isUsed = attrs.post.likeAction && attrs.post.likeAction.acted;
              canUndo =
                attrs.post.likeAction &&
                ((attrs.post.likeAction.acted &&
                  attrs.post.likeAction.canToggle) ||
                  !attrs.post.likeAction.acted);
            } else {
              isUsed = attrs.post.current_user_reactions.findBy("id", reaction);
              canUndo = !isUsed || isUsed.can_undo;
            }

            let title;
            let titleOptions;
            if (canUndo) {
              title = "discourse_reactions.picker.react_with";
              titleOptions = { reaction };
            } else {
              title = "discourse_reactions.picker.cant_remove_reaction";
            }

            return this.attach("button", {
              action: "toggleReaction",
              actionParam: { reaction, postId: attrs.post.id, canUndo },
              className: `pickable-reaction ${reaction} ${
                canUndo ? "can-undo" : ""
              } ${isUsed ? "is-used" : ""}`,
              title,
              titleOptions,
              contents: [
                new RawHtml({
                  html: emojiUnescape(`:${reaction}:`)
                })
              ]
            });
          })
        )
      ];
    }
  }
});
