// ==UserScript==
// @name         zhihu-hide-menu
// @version      0.0.5
// @author       you
// @match        https://www.zhihu.com/*
// @match        https://zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @connect      www.zhihu.com
// @connect      zhihu.com
// @connect      zhuanlan.zhihu.com
// @connect      *.zhimg.com
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// ==/UserScript==
(function() {
	"use strict";
	var toolkit_default = "html.zhmt-enabled body{margin:0!important}html.zhmt-page-question-detail body,html.zhmt-page-post body{background-color:var(--zh-bg,var(--zhmt-native-bg,Canvas))!important;padding:50px 0!important;transition:background-color .5s!important}@keyframes zh-page-enter{0%{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}.zhmt-hidden,.zhmt-blocked,html.zhmt-enabled .zh-hidden-by-immersive,html.zhmt-enabled .AppHeader,html.zhmt-enabled .ColumnPageHeader,html.zhmt-enabled .Post-StickyBar,html.zhmt-enabled .BottomActions,html.zhmt-enabled .CornerButtons,html.zhmt-enabled .GlobalSideBar,html.zhmt-enabled .Topstory-sideBar,html.zhmt-enabled .TopstorySideBar,html.zhmt-enabled .Topstory-sidebar,html.zhmt-enabled [class*=Topstory][class*=side],html.zhmt-enabled [class*=Topstory][class*=Side],html.zhmt-enabled .Question-sideColumn,html.zhmt-enabled .Question-mainColumnLogin,html.zhmt-enabled .Footer,html.zhmt-enabled .CreatorEntrance,html.zhmt-enabled .TopstoryTabs{visibility:hidden!important;display:none!important;position:static!important}html.zhmt-page-home body>div>header,html.zhmt-page-home body>div>nav,html.zhmt-page-home body>header,html.zhmt-page-home body>nav,html.zhmt-page-question-detail body>div>header,html.zhmt-page-question-detail body>div>nav,html.zhmt-page-question-detail body>header,html.zhmt-page-question-detail body>nav{visibility:hidden!important;display:none!important}html.zhmt-enabled .zhmt-readable-shell,html.zhmt-enabled .Question-main,html.zhmt-enabled .Post-main,html.zhmt-enabled .Post-Row-Content{box-shadow:none!important;background:0 0!important;justify-content:center!important}html.zhmt-enabled .zhmt-readable-main,html.zhmt-enabled .Question-mainColumn,html.zhmt-enabled .Post-Row-Content-left,html.zhmt-enabled .Post-content{margin-left:auto!important;margin-right:auto!important}html.zhmt-enabled [data-zhmt-immersive-wrapper=true].zhmt-immersive-wrapper,html.zhmt-enabled #immersive-wrapper{animation:.3s ease-out zh-page-enter;color:var(--zh-text,var(--zhmt-native-text,CanvasText))!important;margin:0 auto!important;font-size:18px!important;line-height:2.2!important;transition:all .5s!important;display:block!important;position:relative!important}html.zhmt-page-question-detail [data-zhmt-immersive-wrapper=true].zh-question-wrapper,html.zhmt-page-post [data-zhmt-immersive-wrapper=true],html.zhmt-page-question-detail #immersive-wrapper.zh-question-wrapper,html.zhmt-page-post #immersive-wrapper{box-sizing:border-box!important;background-color:var(--zh-paper,var(--zhmt-native-surface,Canvas))!important;border-left:2px solid var(--zh-accent,var(--zhmt-native-primary,Highlight))!important;border-right:1px solid var(--zh-border,var(--zhmt-native-border,ButtonBorder))!important;border-radius:4px!important;max-width:760px!important;padding:60px 80px!important;box-shadow:0 4px 25px #0000000f!important}html.zhmt-page-post [data-zhmt-immersive-wrapper=true],html.zhmt-page-post #immersive-wrapper{max-width:760px!important}html.zhmt-page-question-detail .QuestionHeader{box-sizing:border-box!important;width:auto!important;min-width:0!important;max-width:none!important;color:var(--zh-text,var(--zhmt-native-text,CanvasText))!important;box-shadow:none!important;background:0 0!important;border:0!important;border-radius:0!important;margin:0 0 28px!important;padding:0!important}html.zhmt-page-question-detail .QuestionHeader:before{display:none!important}html.zhmt-page-question-detail .Question-main{margin-top:0!important}html.zhmt-page-question-detail .QuestionHeader-content,html.zhmt-page-question-detail .QuestionHeader-main{width:auto!important;min-width:0!important;max-width:none!important;margin:0!important;padding:0!important}html.zhmt-page-question-detail .QuestionHeader-side,html.zhmt-page-question-detail .QuestionHeader-tags,html.zhmt-page-question-detail .QuestionHeaderActions{display:none!important}html.zhmt-page-question-detail .QuestionHeader-detail,html.zhmt-page-question-detail .QuestionRichText,html.zhmt-page-question-detail .QuestionHeader-topics{color:var(--zh-text,var(--zhmt-native-text,CanvasText))!important;line-height:1.8!important}html.zhmt-page-question-detail .Question-main,html.zhmt-page-post .Post-main,html.zhmt-page-post .Post-Row-Content{min-height:100vh!important;padding:0!important}html.zhmt-page-question-detail .Question-main>div,html.zhmt-page-question-detail .Question-mainColumn,html.zhmt-page-question-detail .QuestionAnswers-answers,html.zhmt-page-question-detail .QuestionAnswer-content{width:auto!important;min-width:0!important;max-width:none!important}html.zhmt-page-question-detail .Question-mainColumn,html.zhmt-page-question-detail .QuestionHeader-content,html.zhmt-page-question-detail .QuestionHeader-footer,html.zhmt-page-question-detail .AnswerCard,html.zhmt-page-question-detail .List-item,html.zhmt-page-question-detail .ContentItem,html.zhmt-page-question-detail .zh-question-native-card,html.zhmt-page-post .Post-content,html.zhmt-page-post .Post-RichText{max-width:none!important;box-shadow:none!important;background:0 0!important;border-radius:0!important;margin-left:0!important;margin-right:0!important}html.zhmt-page-question-detail #immersive-wrapper .zh-question-answer-view,html.zhmt-page-question-detail [data-zhmt-immersive-wrapper=true].zh-question-wrapper .zh-question-answer-view,html.zhmt-page-question-detail #immersive-wrapper .AnswerCard,html.zhmt-page-question-detail [data-zhmt-immersive-wrapper=true].zh-question-wrapper .AnswerCard,html.zhmt-page-question-detail #immersive-wrapper .List-item,html.zhmt-page-question-detail [data-zhmt-immersive-wrapper=true].zh-question-wrapper .List-item,html.zhmt-page-question-detail #immersive-wrapper .ContentItem,html.zhmt-page-question-detail [data-zhmt-immersive-wrapper=true].zh-question-wrapper .ContentItem{color:var(--zh-text,var(--zhmt-native-text,CanvasText))!important;box-shadow:none!important;background:0 0!important;border:0!important;border-radius:0!important;margin:0!important;padding:0!important}html.zhmt-page-question-detail #immersive-wrapper .List-item+.List-item,html.zhmt-page-question-detail [data-zhmt-immersive-wrapper=true].zh-question-wrapper .List-item+.List-item,html.zhmt-page-question-detail #immersive-wrapper .AnswerCard+.AnswerCard,html.zhmt-page-question-detail [data-zhmt-immersive-wrapper=true].zh-question-wrapper .AnswerCard+.AnswerCard{border-top:1px dashed var(--zh-border,var(--zhmt-native-border,ButtonBorder))!important;margin-top:32px!important;padding-top:32px!important}html.zhmt-page-question-detail .QuestionHeader-detail.zh-question-detail{background:var(--zh-quote,var(--zhmt-native-bg,Canvas))!important;border:1px dashed var(--zh-border,var(--zhmt-native-border,ButtonBorder))!important;border-radius:4px!important;margin:0 0 30px!important;padding:0 16px!important}html.zhmt-page-question-detail .QuestionHeader-footer{border-top:1px dashed var(--zh-border,var(--zhmt-native-border,ButtonBorder))!important;flex-wrap:wrap!important;gap:10px!important;margin-top:18px!important;padding-top:16px!important;display:flex!important}html.zhmt-page-question-detail .QuestionHeader-footer .Button,html.zhmt-page-question-detail .QuestionHeader-footer button,html.zhmt-page-question-detail #immersive-wrapper .ContentItem-actions button,html.zhmt-page-question-detail [data-zhmt-immersive-wrapper=true].zh-question-wrapper .ContentItem-actions button{border-radius:4px!important}html.zhmt-enabled.zhmt-page-question-detail body .QuestionHeader{background:0 0!important;border:0!important;width:auto!important;min-width:0!important;max-width:none!important}html.zhmt-enabled.zhmt-page-question-detail body #immersive-wrapper.zh-question-wrapper,html.zhmt-enabled.zhmt-page-question-detail body [data-zhmt-immersive-wrapper=true].zh-question-wrapper{width:auto!important;min-width:0!important;max-width:760px!important}html.zhmt-enabled [data-zhmt-immersive-wrapper=true] h1,html.zhmt-enabled [data-zhmt-immersive-wrapper=true] h2,html.zhmt-enabled [data-zhmt-immersive-wrapper=true] h3,html.zhmt-enabled #immersive-wrapper h1,html.zhmt-enabled #immersive-wrapper h2,html.zhmt-enabled #immersive-wrapper h3{color:var(--zh-title,var(--zhmt-native-text,CanvasText))!important;letter-spacing:0!important;border-bottom:1px dashed var(--zh-border,var(--zhmt-native-border,ButtonBorder))!important;margin-top:1.5em!important;padding-bottom:12px!important;font-weight:700!important}html.zhmt-page-question-detail [data-zhmt-immersive-wrapper=true] .QuestionHeader-title,html.zhmt-page-question-detail [data-zhmt-immersive-wrapper=true] h1.QuestionHeader-title,html.zhmt-page-question-detail [data-zhmt-immersive-wrapper=true] h1,html.zhmt-page-question-detail .zh-question-title,html.zhmt-page-question-detail .QuestionHeader .QuestionHeader-title,html.zhmt-page-question-detail .QuestionHeader h1.QuestionHeader-title,html.zhmt-page-question-detail #immersive-wrapper .QuestionHeader-title,html.zhmt-page-question-detail #immersive-wrapper h1.QuestionHeader-title,html.zhmt-page-question-detail #immersive-wrapper h1{border-bottom:2px solid var(--zh-accent,var(--zhmt-native-primary,Highlight))!important;margin:0 0 18px!important;padding-bottom:16px!important;font-size:30px!important;line-height:1.45!important}html.zhmt-page-question-detail .zh-question-detail{background:var(--zh-quote,var(--zhmt-native-bg,Canvas))!important;border:1px dashed var(--zh-border,var(--zhmt-native-border,ButtonBorder))!important;border-radius:4px!important;margin:0 0 30px!important;padding:0 16px!important}html.zhmt-page-question-detail .zh-question-detail-body{padding:0 0 16px!important}html.zhmt-page-question-detail .zh-question-toolbar{flex-wrap:wrap!important;gap:10px!important;margin:12px 0 28px!important;display:flex!important}html.zhmt-page-question-detail .Reward,html.zhmt-page-question-detail .FollowButton{display:none!important}html.zhmt-page-question-detail #immersive-wrapper .RichContent,html.zhmt-page-question-detail [data-zhmt-immersive-wrapper=true].zh-question-wrapper .RichContent{line-height:inherit!important}html.zhmt-enabled [data-zhmt-immersive-wrapper=true] blockquote,html.zhmt-enabled #immersive-wrapper blockquote{color:var(--zh-text,var(--zhmt-native-text,CanvasText))!important;background:var(--zh-quote,var(--zhmt-native-bg,Canvas))!important;border-left:4px solid var(--zh-accent,var(--zhmt-native-primary,Highlight))!important;margin:20px 0!important;padding:15px 20px!important}html.zhmt-enabled [data-zhmt-immersive-wrapper=true] a,html.zhmt-enabled #immersive-wrapper a{color:var(--zh-accent,var(--zhmt-native-primary,LinkText))!important;border-bottom:1px solid var(--zh-accent,var(--zhmt-native-primary,LinkText))!important;text-decoration:none!important}html.zhmt-enabled [data-zhmt-immersive-wrapper=true] pre,html.zhmt-enabled #immersive-wrapper pre{background-color:var(--zh-code,var(--zhmt-native-surface,Canvas))!important;border-radius:6px!important;padding:1em 1.2em!important;line-height:1.5!important;overflow-x:auto!important}html.zhmt-enabled [data-zhmt-immersive-wrapper=true] pre code,html.zhmt-enabled #immersive-wrapper pre code{font-size:inherit!important;background:0 0!important;padding:0!important}html.zhmt-enabled [data-zhmt-immersive-wrapper=true] code:not(pre code),html.zhmt-enabled #immersive-wrapper code:not(pre code){background-color:var(--zh-code,var(--zhmt-native-surface,Canvas))!important;font-size:inherit!important;border-radius:3px!important;padding:.2em .4em!important}html.zhmt-enabled [data-zhmt-immersive-wrapper=true] img,html.zhmt-enabled #immersive-wrapper img{border-radius:6px!important;max-width:100%!important;height:auto!important;box-shadow:0 4px 12px #0000001a!important}html.zhmt-page-question-detail #immersive-wrapper img.Avatar,html.zhmt-page-question-detail #immersive-wrapper .Avatar img,html.zhmt-page-question-detail #immersive-wrapper .AuthorInfo-avatarWrapper img,html.zhmt-page-question-detail [data-zhmt-immersive-wrapper=true].zh-question-wrapper img.Avatar,html.zhmt-page-question-detail [data-zhmt-immersive-wrapper=true].zh-question-wrapper .Avatar img,html.zhmt-page-question-detail [data-zhmt-immersive-wrapper=true].zh-question-wrapper .AuthorInfo-avatarWrapper img{aspect-ratio:1!important;object-fit:cover!important;width:36px!important;min-width:36px!important;max-width:36px!important;height:36px!important;min-height:36px!important;max-height:36px!important;box-shadow:none!important;cursor:default!important;border-radius:5px!important;flex:0 0 36px!important}html.zhmt-page-question-detail #immersive-wrapper .AuthorInfo img.Avatar,html.zhmt-page-question-detail #immersive-wrapper .AuthorInfo .Avatar img,html.zhmt-page-question-detail #immersive-wrapper .AnswerItem-authorInfo img.Avatar,html.zhmt-page-question-detail #immersive-wrapper .AnswerItem-authorInfo .Avatar img,html.zhmt-page-question-detail [data-zhmt-immersive-wrapper=true].zh-question-wrapper .AuthorInfo img.Avatar,html.zhmt-page-question-detail [data-zhmt-immersive-wrapper=true].zh-question-wrapper .AuthorInfo .Avatar img,html.zhmt-page-question-detail [data-zhmt-immersive-wrapper=true].zh-question-wrapper .AnswerItem-authorInfo img.Avatar,html.zhmt-page-question-detail [data-zhmt-immersive-wrapper=true].zh-question-wrapper .AnswerItem-authorInfo .Avatar img{flex-basis:40px!important;width:40px!important;min-width:40px!important;max-width:40px!important;height:40px!important;min-height:40px!important;max-height:40px!important}html.zhmt-page-home .Topstory,html.zhmt-page-home .Topstory-container,html.zhmt-page-home .zhmt-modern-home-shell{justify-content:flex-start!important;align-items:flex-start!important}html.zhmt-page-home .Topstory-container,html.zhmt-page-home .zhmt-modern-home-shell{box-sizing:border-box!important;width:1000px!important;max-width:100%!important;margin-left:auto!important;margin-right:auto!important}html.zhmt-page-home .Topstory-mainColumn,html.zhmt-page-home .zhmt-modern-home-main,html.zhmt-page-home [data-zhmt-immersive-wrapper=true].zh-home-wrapper,html.zhmt-page-home #immersive-wrapper.zh-home-wrapper{width:694px!important;max-width:694px!important;box-shadow:none!important;font-size:inherit!important;line-height:inherit!important;border:0!important;border-radius:0!important;margin-left:0!important;margin-right:0!important;padding:0 0 72px!important}html.zhmt-page-home .Topstory-mainColumnCard,html.zhmt-page-home #TopstoryContent,html.zhmt-page-home .ListShortcut,html.zhmt-page-home .Topstory-recommend{box-sizing:border-box!important;width:100%!important;max-width:694px!important;box-shadow:none!important;border:0!important;border-radius:0!important;margin-left:0!important;margin-right:0!important;padding:0!important;display:block!important}html.zhmt-page-home #immersive-wrapper.zh-home-wrapper,html.zhmt-page-home [data-zhmt-immersive-wrapper=true].zh-home-wrapper{color:inherit!important;font-size:inherit!important;line-height:inherit!important;margin:0!important}html.zhmt-page-home .zhmt-home-side-column,html.zhmt-page-home .zhmt-home-composer,html.zhmt-page-home .WriteArea,html.zhmt-page-home .zhmt-home-pager-control{visibility:hidden!important;display:none!important}html.zhmt-page-home .zhmt-home-load-more{pointer-events:none!important;opacity:0!important;border:0!important;width:1px!important;min-width:1px!important;height:1px!important;min-height:1px!important;margin:0!important;padding:0!important;overflow:hidden!important}.zhmt-home-autoload-sentinel{width:100%;height:1px}html.zhmt-page-home [data-zhmt-immersive-wrapper=true] .zhmt-home-feed-item,html.zhmt-page-home #immersive-wrapper .zhmt-home-feed-item,html.zhmt-page-home [data-zhmt-immersive-wrapper=true] .zh-home-card,html.zhmt-page-home #immersive-wrapper .zh-home-card{animation:.25s ease-out zh-page-enter;box-sizing:border-box!important;cursor:pointer!important;flex-direction:column!important;gap:8px!important;width:100%!important;max-width:100%!important;margin:0 0 16px!important;padding:16px 18px!important;display:flex!important}html.zhmt-page-home [data-zhmt-immersive-wrapper=true] .ContentItem-title,html.zhmt-page-home [data-zhmt-immersive-wrapper=true] .zh-home-card-title,html.zhmt-page-home [data-zhmt-immersive-wrapper=true] h2,html.zhmt-page-home #immersive-wrapper .ContentItem-title,html.zhmt-page-home #immersive-wrapper .zh-home-card-title,html.zhmt-page-home #immersive-wrapper h2{color:inherit!important;-webkit-line-clamp:2!important;border-bottom:0!important;-webkit-box-orient:vertical!important;margin:0 0 8px!important;padding-bottom:0!important;font-size:17px!important;font-weight:700!important;line-height:1.5!important;display:-webkit-box!important;overflow:hidden!important}html.zhmt-page-home [data-zhmt-immersive-wrapper=true] a,html.zhmt-page-home #immersive-wrapper a{color:inherit!important;border-bottom:0!important;text-decoration:none!important}html.zhmt-page-home [data-zhmt-immersive-wrapper=true] .RichText,html.zhmt-page-home [data-zhmt-immersive-wrapper=true] .RichContent-inner,html.zhmt-page-home [data-zhmt-immersive-wrapper=true] .zh-home-card-snippet,html.zhmt-page-home #immersive-wrapper .RichText,html.zhmt-page-home #immersive-wrapper .RichContent-inner,html.zhmt-page-home #immersive-wrapper .zh-home-card-snippet{color:inherit!important;opacity:1!important;-webkit-line-clamp:3!important;-webkit-box-orient:vertical!important;font-size:14px!important;line-height:1.6!important;display:-webkit-box!important;overflow:hidden!important}html.zhmt-page-home [data-zhmt-immersive-wrapper=true] .zhmt-home-feed-item>.ContentItem,html.zhmt-page-home [data-zhmt-immersive-wrapper=true] .zhmt-home-feed-item .ContentItem-main,html.zhmt-page-home [data-zhmt-immersive-wrapper=true] .zhmt-home-feed-item .ContentItem,html.zhmt-page-home [data-zhmt-immersive-wrapper=true] .zhmt-home-feed-item .RichContent,html.zhmt-page-home [data-zhmt-immersive-wrapper=true] .zhmt-home-feed-item .RichContent-inner,html.zhmt-page-home #immersive-wrapper .zhmt-home-feed-item>.ContentItem,html.zhmt-page-home #immersive-wrapper .zhmt-home-feed-item .ContentItem-main,html.zhmt-page-home #immersive-wrapper .zhmt-home-feed-item .ContentItem,html.zhmt-page-home #immersive-wrapper .zhmt-home-feed-item .RichContent,html.zhmt-page-home #immersive-wrapper .zhmt-home-feed-item .RichContent-inner{width:auto!important;max-width:none!important;margin:0!important;padding:0!important}html.zhmt-page-home [data-zhmt-immersive-wrapper=true] .zhmt-home-feed-item .AuthorInfo,html.zhmt-page-home #immersive-wrapper .zhmt-home-feed-item .AuthorInfo,html.zhmt-page-home [data-zhmt-immersive-wrapper=true] .zh-home-card-meta,html.zhmt-page-home #immersive-wrapper .zh-home-card-meta{color:inherit!important;opacity:1!important;flex-wrap:wrap!important;align-items:center!important;gap:6px!important;margin:8px 0 10px!important;font-size:13px!important;line-height:1.4!important;display:flex!important}html.zhmt-page-home [data-zhmt-immersive-wrapper=true] .zh-home-card-type,html.zhmt-page-home #immersive-wrapper .zh-home-card-type{white-space:nowrap!important;border-radius:3px!important;padding:1px 5px!important;font-size:11px!important;display:inline-block!important}html.zhmt-page-home [data-zhmt-immersive-wrapper=true] .zhmt-home-feed-item img.Avatar,html.zhmt-page-home #immersive-wrapper .zhmt-home-feed-item img.Avatar,html.zhmt-page-home [data-zhmt-immersive-wrapper=true] .zhmt-home-feed-item .Avatar img,html.zhmt-page-home #immersive-wrapper .zhmt-home-feed-item .Avatar img{object-fit:cover!important;width:32px!important;min-width:32px!important;max-width:32px!important;height:32px!important;min-height:32px!important;max-height:32px!important;box-shadow:none!important;border-radius:5px!important}html.zhmt-enabled .ContentItem-actions,html.zhmt-enabled .RichContent-actions,html.zhmt-enabled .ContentItem-actions.Sticky,html.zhmt-enabled .RichContent-actions.Sticky,html.zhmt-enabled .ContentItem-actions.is-fixed,html.zhmt-enabled .RichContent-actions.is-fixed,html.zhmt-enabled [data-zhmt-immersive-wrapper=true] .ContentItem-actions,html.zhmt-enabled #immersive-wrapper .ContentItem-actions{visibility:visible!important;border-top:1px dashed var(--zh-border,var(--zhmt-native-border,ButtonBorder))!important;box-shadow:none!important;opacity:1!important;background:0 0!important;flex-wrap:wrap!important;gap:8px!important;margin-top:20px!important;padding-top:20px!important;display:flex!important;position:static!important;bottom:auto!important}html.zhmt-enabled .VoteButton{border-radius:4px!important}.zh-inline-btn,.zh-action-btn{box-sizing:border-box;height:34px;color:var(--zh-accent,var(--zhmt-native-primary,Highlight));white-space:nowrap;cursor:pointer;background:var(--zh-paper,var(--zhmt-native-surface,Canvas));border:1px solid var(--zh-accent,var(--zhmt-native-primary,Highlight));border-radius:4px;outline:none;justify-content:center;align-items:center;gap:4px;padding:0 14px;transition:all .15s;display:inline-flex;text-decoration:none!important}.zh-action-btn{height:auto;min-height:30px;color:var(--zh-text,var(--zhmt-native-text,CanvasText));border-color:var(--zh-border,var(--zhmt-native-border,ButtonBorder));padding:6px 12px}.zh-inline-btn:hover,.zh-action-btn:hover,.zh-action-btn.is-active{color:var(--zh-paper,var(--zhmt-native-surface,Canvas));background:var(--zh-accent,var(--zhmt-native-primary,Highlight));border-color:var(--zh-accent,var(--zhmt-native-primary,Highlight))}.zh-inline-btn:focus-visible{color:var(--zh-paper,var(--zhmt-native-surface,Canvas));background:var(--zh-accent,var(--zhmt-native-primary,Highlight));border-color:var(--zh-accent,var(--zhmt-native-primary,Highlight))}.zh-action-btn:focus-visible{color:var(--zh-paper,var(--zhmt-native-surface,Canvas));background:var(--zh-accent,var(--zhmt-native-primary,Highlight));border-color:var(--zh-accent,var(--zhmt-native-primary,Highlight))}.zh-space-layout{gap:20px;min-height:70vh;margin-top:20px;display:flex}.zh-space-sidebar{border-right:1px dashed var(--zh-border,var(--zhmt-native-border,ButtonBorder));flex-direction:column;flex-shrink:0;gap:6px;width:180px;padding-right:16px;display:flex}.zh-space-sidebar-title{color:var(--zh-accent,var(--zhmt-native-primary,Highlight));border-bottom:2px solid var(--zh-accent,var(--zhmt-native-primary,Highlight));align-items:center;gap:6px;margin-bottom:12px;padding:10px 12px 14px;font-weight:700;display:flex}.zh-space-tab-btn{color:var(--zh-text,var(--zhmt-native-text,CanvasText));text-align:left;cursor:pointer;background:0 0;border:0;border-radius:6px;align-items:center;gap:10px;padding:10px 14px;transition:all .15s;display:flex}.zh-space-tab-btn:hover{color:var(--zh-accent,var(--zhmt-native-primary,Highlight));background:var(--zh-quote,var(--zhmt-native-bg,Canvas))}.zh-space-tab-btn:focus-visible{color:var(--zh-accent,var(--zhmt-native-primary,Highlight));background:var(--zh-quote,var(--zhmt-native-bg,Canvas))}.zh-space-tab-btn.is-active{color:var(--zh-paper,var(--zhmt-native-surface,Canvas));background:var(--zh-accent,var(--zhmt-native-primary,Highlight));font-weight:700}.zh-space-content{flex-direction:column;flex:1;min-width:0;display:flex}#zh-tools-panel.zhmt-toolbar{z-index:999999!important;visibility:visible!important;color:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important;opacity:1!important;background:0 0!important;border:0!important;flex-direction:column!important;gap:10px!important;padding:0!important;transition:opacity .3s!important;display:flex!important;position:fixed!important;bottom:30px!important;right:30px!important}@keyframes zh-toolbar-pop{0%{opacity:0;transform:scale(.4)translateY(8px)}to{opacity:1;transform:scale(1)translateY(0)}}.zh-square-btn,.zhmt-toolbar__button.zh-square-btn{animation:.3s cubic-bezier(.34,1.56,.64,1) both zh-toolbar-pop;width:38px!important;min-width:38px!important;height:38px!important;min-height:38px!important;color:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important;cursor:pointer!important;background-color:var(--zh-paper,var(--zhmt-native-surface,Canvas))!important;border:1px solid var(--zh-accent,var(--zhmt-native-primary,Highlight))!important;border-radius:4px!important;justify-content:center!important;align-items:center!important;margin:0!important;padding:0!important;transition:all .2s!important;display:flex!important;position:relative!important;box-shadow:0 4px 10px #00000026!important}.zhmt-toolbar__tooltip{z-index:1!important;width:max-content!important;max-width:180px!important;color:var(--zh-paper,var(--zhmt-native-surface,Canvas))!important;pointer-events:none!important;background:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important;opacity:0!important;white-space:nowrap!important;border-radius:4px!important;padding:6px 9px!important;font-size:12px!important;font-weight:500!important;line-height:1.2!important;transition:opacity 80ms,transform 80ms!important;display:block!important;position:absolute!important;top:50%!important;right:calc(100% + 10px)!important;transform:translate(4px,-50%)!important;box-shadow:0 4px 12px #0000002e!important}.zhmt-toolbar__tooltip:after{border-top:5px solid #0000!important;border-bottom:5px solid #0000!important;border-left:5px solid var(--zh-accent,var(--zhmt-native-primary,Highlight))!important;content:\"\"!important;width:0!important;height:0!important;position:absolute!important;top:50%!important;right:-5px!important;transform:translateY(-50%)!important}.zh-square-btn:hover .zhmt-toolbar__tooltip,.zhmt-toolbar__button.zh-square-btn:hover .zhmt-toolbar__tooltip{opacity:1!important;transform:translateY(-50%)!important}.zh-square-btn:focus-visible .zhmt-toolbar__tooltip{opacity:1!important;transform:translateY(-50%)!important}.zhmt-toolbar__button.zh-square-btn:focus-visible .zhmt-toolbar__tooltip{opacity:1!important;transform:translateY(-50%)!important}.zh-square-btn:hover,.zhmt-toolbar__button.zh-square-btn:hover,.zh-btn-active{color:var(--zh-paper,var(--zhmt-native-surface,Canvas))!important;background-color:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important}.zh-square-btn:focus-visible{color:var(--zh-paper,var(--zhmt-native-surface,Canvas))!important;background-color:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important}.zhmt-toolbar__button.zh-square-btn:focus-visible{color:var(--zh-paper,var(--zhmt-native-surface,Canvas))!important;background-color:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important}.zh-square-btn svg,.zhmt-toolbar__button.zh-square-btn svg{fill:currentColor!important;stroke:currentColor!important;width:20px!important;height:20px!important}.zh-square-btn.zh-btn-disabled,.zhmt-toolbar__button.zh-square-btn.zh-btn-disabled{color:var(--zh-text,var(--zhmt-native-text,CanvasText))!important;cursor:not-allowed!important;border-color:var(--zh-border,var(--zhmt-native-border,ButtonBorder))!important;opacity:.45!important}.zh-square-btn.zh-btn-disabled:hover,.zhmt-toolbar__button.zh-square-btn.zh-btn-disabled:hover{color:var(--zh-text,var(--zhmt-native-text,CanvasText))!important;background-color:var(--zh-paper,var(--zhmt-native-surface,Canvas))!important}.zh-copy-md-container.zhmt-markdown-control{z-index:999998!important;visibility:visible!important;color:var(--zh-text,var(--zhmt-native-text,CanvasText))!important;background:0 0!important;border:0!important;border-radius:6px!important;align-items:stretch!important;display:flex!important;position:fixed!important;top:20px!important;right:80px!important;overflow:visible!important;box-shadow:0 2px 10px #0000001a!important}.zh-copy-md-btn,.zh-copy-md-drop,.zh-copy-md-option,.zhmt-button,.zhmt-ghost-button,.zhmt-icon-button{font:inherit!important;color:inherit!important;cursor:pointer!important}.zh-copy-md-btn{min-height:34px!important;color:var(--zh-text,var(--zhmt-native-text,CanvasText))!important;white-space:nowrap!important;background:var(--zh-paper,var(--zhmt-native-surface,Canvas))!important;border:1px solid var(--zh-border,var(--zhmt-native-border,ButtonBorder))!important;border-right:0!important;border-radius:6px 0 0 6px!important;align-items:center!important;gap:5px!important;padding:7px 12px!important;transition:all .15s!important;display:inline-flex!important}.zh-copy-md-drop{min-width:28px!important;min-height:34px!important;color:var(--zh-text,var(--zhmt-native-text,CanvasText))!important;background:var(--zh-paper,var(--zhmt-native-surface,Canvas))!important;border:1px solid var(--zh-border,var(--zhmt-native-border,ButtonBorder))!important;border-radius:0 6px 6px 0!important;justify-content:center!important;align-items:center!important;padding:7px 6px!important;transition:all .15s!important;display:inline-flex!important}.zh-copy-md-btn:hover,.zh-copy-md-drop:hover{color:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important;border-color:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important}.zh-copy-md-btn:focus-visible{color:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important;border-color:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important}.zh-copy-md-drop:focus-visible{color:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important;border-color:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important}.zh-copy-md-btn svg{fill:none!important;stroke:currentColor!important;stroke-width:2px!important;flex-shrink:0!important;width:14px!important;height:14px!important}.zh-copy-md-drop svg{fill:currentColor!important;stroke:none!important;width:12px!important;height:12px!important}.zh-copy-md-menu{background:var(--zh-paper,var(--zhmt-native-surface,Canvas))!important;border:1px solid var(--zh-border,var(--zhmt-native-border,ButtonBorder))!important;border-radius:6px!important;min-width:180px!important;margin-top:4px!important;padding:0!important;display:none!important;position:absolute!important;top:100%!important;right:0!important;overflow:hidden!important;box-shadow:0 4px 16px #0000001f!important}.zh-copy-md-menu-show,.zhmt-markdown-control--open .zh-copy-md-menu{display:block!important}.zh-copy-md-option{width:100%!important;min-height:0!important;color:var(--zh-text,var(--zhmt-native-text,CanvasText))!important;text-align:left!important;white-space:nowrap!important;background:0 0!important;border:0!important;border-radius:0!important;padding:10px 14px!important;transition:background .1s!important;display:block!important}.zh-copy-md-option:hover{color:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important;background:var(--zh-quote,var(--zhmt-native-bg,Canvas))!important}.zh-copy-md-option:focus-visible{color:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important;background:var(--zh-quote,var(--zhmt-native-bg,Canvas))!important}.zhmt-toast,#zh-toast{z-index:999999999;color:var(--zh-text,var(--zhmt-native-text,CanvasText));pointer-events:none;background:var(--zh-paper,var(--zhmt-native-surface,Canvas));border:1px solid var(--zh-border,var(--zhmt-native-border,ButtonBorder));opacity:0;border-radius:8px;padding:10px 22px;transition:opacity .25s,transform .25s;position:fixed;top:36px;left:50%;transform:translate(-50%)translateY(-12px);box-shadow:0 6px 24px #0000001f}.zhmt-toast--visible,#zh-toast.zh-toast-show{opacity:1;transform:translate(-50%)translateY(0)}.zhmt-modal,.zh-modal-overlay{z-index:9999999;color:var(--zh-text,var(--zhmt-native-text,CanvasText));background:#00000080;justify-content:center;align-items:center;padding:24px;animation:.25s forwards zh-modal-fade-in;display:flex;position:fixed;top:0;bottom:0;left:0;right:0}.zhmt-modal__panel,.zh-modal{width:min(860px,100%);max-height:min(760px,100vh - 48px);color:var(--zh-text,var(--zhmt-native-text,CanvasText));background:var(--zh-modal-bg,var(--zhmt-native-surface,Canvas));border:2px solid var(--zh-accent,var(--zhmt-native-primary,Highlight));border-radius:6px;flex-direction:column;animation:.32s cubic-bezier(.34,1.56,.64,1) forwards zh-modal-pop-in;display:flex;overflow:hidden;box-shadow:0 10px 30px #0000004d}.zhmt-modal__header,.zhmt-modal__footer,.zh-modal-header,.zh-modal-footer{border-bottom:1px dashed var(--zh-accent,var(--zhmt-native-primary,Highlight));justify-content:space-between;align-items:center;gap:12px;padding:15px 20px;display:flex}.zhmt-modal__footer,.zh-modal-footer{border-top:1px dashed var(--zh-accent,var(--zhmt-native-primary,Highlight));border-bottom:0;justify-content:flex-start}.zhmt-modal__header h2,.zh-modal-header h2{margin:0;font-size:1.1em;font-weight:700}.zhmt-modal__body,.zh-modal-body,.zhmt-blocklist-panel{overflow:auto}.zhmt-blocklist-panel{width:min(420px,90vw)!important}.zhmt-modal__body,.zh-modal-body{max-height:70vh;padding:25px 20px;font-size:.95em;line-height:1.8;overflow-y:auto}.zhmt-icon-button,.zhmt-button,.zhmt-ghost-button{color:var(--zh-text,var(--zhmt-native-text,CanvasText))!important;background:var(--zh-paper,var(--zhmt-native-surface,Canvas))!important;border:1px solid var(--zh-border,var(--zhmt-native-border,ButtonBorder))!important;border-radius:4px!important;transition:all .15s!important}.zhmt-icon-button{place-items:center;width:32px;height:32px;padding:0;display:inline-grid}.zhmt-button,.zhmt-ghost-button{padding:8px 14px}.zhmt-button:hover,.zhmt-ghost-button:hover,.zhmt-icon-button:hover{color:var(--zh-paper,var(--zhmt-native-surface,Canvas))!important;background:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important;border-color:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important}.zhmt-button:focus-visible{color:var(--zh-paper,var(--zhmt-native-surface,Canvas))!important;background:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important;border-color:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important}.zhmt-ghost-button:focus-visible{color:var(--zh-paper,var(--zhmt-native-surface,Canvas))!important;background:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important;border-color:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important}.zhmt-icon-button:focus-visible{color:var(--zh-paper,var(--zhmt-native-surface,Canvas))!important;background:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important;border-color:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important}.zhmt-button--primary{color:var(--zh-paper,var(--zhmt-native-surface,Canvas))!important;background:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important;border-color:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important;font-weight:700!important}.zhmt-button--danger{color:var(--zh-paper,var(--zhmt-native-surface,Canvas))!important;background:#d93025!important;border-color:#d93025!important}.zhmt-button:disabled,.zhmt-ghost-button:disabled,.zhmt-icon-button:disabled{cursor:not-allowed!important;opacity:.5!important}.zhmt-input{box-sizing:border-box;width:100%;min-width:0;color:var(--zh-text,var(--zhmt-native-text,CanvasText));background:var(--zh-code,var(--zhmt-native-bg,Canvas));border:1px solid var(--zh-border,var(--zhmt-native-border,ButtonBorder));border-radius:4px;outline:none;padding:8px 10px}.zhmt-input:focus{border-color:var(--zh-accent,var(--zhmt-native-primary,Highlight))}.zhmt-blocklist-input{resize:vertical;min-height:76px;line-height:1.5}.zh-modal-close{color:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important;background:0 0!important;border:0!important;font-size:24px!important}.zh-modal-close:hover{color:var(--zh-paper,var(--zhmt-native-surface,Canvas))!important;background:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important}.zh-modal-close:focus-visible{color:var(--zh-paper,var(--zhmt-native-surface,Canvas))!important;background:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important}.zhmt-blocklist-form,.zhmt-toggle-group,.zhmt-keyword-list__item{align-items:center;gap:10px;display:flex}.zhmt-blocklist-form,.zhmt-toggle-group{border-bottom:1px dashed var(--zh-border,var(--zhmt-native-border,ButtonBorder));padding:14px 16px}.zhmt-toggle-group{background:var(--zh-quote,var(--zhmt-native-bg,Canvas));flex-wrap:wrap}.zhmt-checkbox{cursor:pointer;background:var(--zh-paper,var(--zhmt-native-surface,Canvas));border:1px solid var(--zh-border,var(--zhmt-native-border,ButtonBorder));border-radius:14px;align-items:center;gap:6px;padding:5px 12px;transition:all .15s;display:inline-flex}.zhmt-checkbox:hover{color:var(--zh-accent,var(--zhmt-native-primary,Highlight));border-color:var(--zh-accent,var(--zhmt-native-primary,Highlight))}.zhmt-keyword-list{margin:0;padding:0;list-style:none;overflow:auto}.zhmt-keyword-list__item{border-bottom:1px solid var(--zh-border,var(--zhmt-native-border,ButtonBorder));justify-content:space-between;padding:10px 16px}.zhmt-keyword-list__item>span{overflow-wrap:anywhere;min-width:0}.zhmt-keyword-list__actions{flex-shrink:0;gap:8px;display:inline-flex}.zhmt-keyword-list__item:hover{background:var(--zh-quote,var(--zhmt-native-bg,Canvas))}.zhmt-profile-panel .Profile-sideColumn,.zhmt-profile-panel .Footer,.zhmt-profile-panel .Sticky{display:none!important}.zhmt-profile-panel{width:min(920px,100%)!important}.zhmt-profile-panel #zh-space-container,.zhmt-profile-panel .zh-space-container{background:var(--zh-paper,var(--zhmt-native-surface,Canvas));border:1px solid var(--zh-border,var(--zhmt-native-border,ButtonBorder));border-radius:8px;margin-top:16px;padding:24px;transition:all .3s;animation:.35s cubic-bezier(.16,1,.3,1) forwards zh-space-enter;box-shadow:0 10px 30px #0000000d}.zhmt-profile-panel .zh-space-avatar{transition:transform .25s,border-color .25s}.zhmt-profile-panel .zh-space-avatar:hover{transform:scale(1.08)rotate(3deg);border-color:var(--zh-accent,var(--zhmt-native-primary,Highlight))!important}.zhmt-profile-panel .ProfileHeader,.zhmt-profile-panel .Profile-main,.zhmt-profile-panel .ProfileMain,.zhmt-profile-panel .Profile-activities,.zhmt-profile-panel .Card{background:var(--zh-paper,var(--zhmt-native-surface,Canvas))!important;border:1px solid var(--zh-border,var(--zhmt-native-border,ButtonBorder))!important;border-radius:6px!important;margin-bottom:14px!important;box-shadow:0 2px 8px #00000008!important}.zhmt-profile-panel img{max-width:100%;height:auto}.zhmt-profile-link{padding-top:12px}@keyframes zh-modal-pop-in{0%{opacity:0;transform:scale(.92)translateY(12px)}to{opacity:1;transform:scale(1)translateY(0)}}@keyframes zh-modal-fade-in{0%{opacity:0}to{opacity:1}}@keyframes zh-modal-fade-out{0%{opacity:1}to{opacity:0}}@keyframes zh-modal-pop-out{0%{opacity:1;transform:scale(1)translateY(0)}to{opacity:0;transform:scale(.92)translateY(12px)}}@keyframes zh-space-enter{0%{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}.zhmt-modal.zh-modal-closing,.zh-modal-overlay.zh-modal-closing{pointer-events:none;animation:.2s forwards zh-modal-fade-out}.zhmt-modal.zh-modal-closing .zhmt-modal__panel,.zh-modal-overlay.zh-modal-closing .zh-modal{animation:.2s forwards zh-modal-pop-out}@media (max-width:860px){html.zhmt-enabled body{margin:0!important}html.zhmt-page-question-detail [data-zhmt-immersive-wrapper=true].zh-question-wrapper,html.zhmt-page-post [data-zhmt-immersive-wrapper=true],html.zhmt-page-question-detail #immersive-wrapper.zh-question-wrapper,html.zhmt-page-post #immersive-wrapper{width:auto!important;max-width:none!important;margin:0 12px!important;padding:30px 18px!important}html.zhmt-page-question-detail .QuestionHeader{width:auto!important;max-width:none!important;margin:0 0 24px!important;padding:0!important}html.zhmt-page-home .Topstory,html.zhmt-page-home .Topstory-container,html.zhmt-page-home .zhmt-modern-home-shell,html.zhmt-page-home .Topstory-mainColumn,html.zhmt-page-home .zhmt-modern-home-main,html.zhmt-page-home [data-zhmt-immersive-wrapper=true].zh-home-wrapper,html.zhmt-page-home #immersive-wrapper.zh-home-wrapper{width:auto!important;max-width:none!important;margin-left:0!important;margin-right:0!important;padding-left:12px!important;padding-right:12px!important}#zh-tools-panel.zhmt-toolbar{bottom:16px!important;right:12px!important}.zh-copy-md-container.zhmt-markdown-control{top:16px!important;right:12px!important}.zhmt-modal{padding:12px}}@media (max-width:900px){.zh-space-layout{flex-direction:column!important;gap:16px!important}.zh-space-sidebar{border-right:0!important;border-bottom:1px dashed var(--zh-border,var(--zhmt-native-border,ButtonBorder))!important;flex-flow:wrap!important;width:100%!important;padding-bottom:16px!important;padding-right:0!important}.zh-space-sidebar-title{border-bottom:0!important;width:100%!important;margin-bottom:4px!important;padding:6px 12px!important}.zh-space-tab-btn{flex:auto!important;justify-content:center!important;padding:8px 12px!important}}@media print{html,body{color:var(--zh-text,#1a1a1a)!important;background:var(--zh-bg,#fff)!important;margin:0!important;padding:0!important}#zh-tools-panel,.zh-copy-md-container,.zhmt-toolbar,.zhmt-modal,.zhmt-toast,.AppHeader,.ColumnPageHeader,.CornerButtons,.GlobalSideBar{display:none!important}[data-zhmt-immersive-wrapper=true],#immersive-wrapper{width:100%!important;max-width:none!important;box-shadow:none!important;background:0 0!important;border:0!important;margin:0!important;padding:0!important;display:block!important}}";
	function onDomReady(callback) {
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", callback, { once: true });
			return;
		}
		callback();
	}
	function injectStyle(cssText) {
		document.querySelectorAll("style[data-zhmt=\"style\"]").forEach((style) => style.remove());
		const style = document.createElement("style");
		style.dataset.zhmt = "style";
		style.textContent = cssText;
		document.head.appendChild(style);
	}
	function createElement(tagName, options = {}) {
		const element = document.createElement(tagName);
		if (options.className) element.className = options.className;
		if (options.text !== void 0) element.textContent = options.text;
		if (options.html !== void 0) element.innerHTML = options.html;
		Object.entries(options.attrs || {}).forEach(([name, value]) => {
			element.setAttribute(name, value);
		});
		return element;
	}
	function hideElementsBySelectors(selectors, root = document) {
		let count = 0;
		selectors.forEach((selector) => {
			root.querySelectorAll(selector).forEach((element) => {
				if (!element.classList.contains("zhmt-hidden")) count += 1;
				element.classList.add("zhmt-hidden");
				element.setAttribute("aria-hidden", "true");
			});
		});
		return count;
	}
	function isVisibleElement(element) {
		const htmlElement = element;
		const rect = htmlElement.getBoundingClientRect();
		const styles = window.getComputedStyle(htmlElement);
		return rect.width > 0 && rect.height > 0 && styles.display !== "none" && styles.visibility !== "hidden";
	}
	function escapeHtml(value) {
		const div = document.createElement("div");
		div.textContent = value;
		return div.innerHTML;
	}
	function removeElements(selectors, root) {
		selectors.forEach((selector) => {
			root.querySelectorAll(selector).forEach((element) => element.remove());
		});
	}
	function debounce(callback, wait) {
		let timeoutId;
		return (...args) => {
			window.clearTimeout(timeoutId);
			timeoutId = window.setTimeout(() => callback(...args), wait);
		};
	}
	function syncNativeTokens() {
		const bodyStyles = window.getComputedStyle(document.body);
		const rootStyles = window.getComputedStyle(document.documentElement);
		const primaryButton = document.querySelector(".Button--primary, .Button--blue");
		const card = document.querySelector(".QuestionHeader, .Post-content, .AppHeader, .TopstoryTabs, .SearchBar, .Card:not(.zhmt-home-composer):not([data-zhmt-immersive-wrapper])");
		const subtleProbe = document.querySelector(".Input, .SearchBar-input, .CommentEditor, .RichContent-actions, .ContentItem-actions, .QuestionRichText");
		const codeProbe = document.querySelector("pre, code, .Highlight, .ztext pre");
		const primaryStyles = primaryButton ? window.getComputedStyle(primaryButton) : void 0;
		const cardStyles = card ? window.getComputedStyle(card) : void 0;
		const subtleStyles = subtleProbe ? window.getComputedStyle(subtleProbe) : void 0;
		const codeStyles = codeProbe ? window.getComputedStyle(codeProbe) : void 0;
		const bg = firstSolidColor(bodyStyles.backgroundColor, rootStyles.backgroundColor, "#ffffff");
		const text = firstSolidColor(bodyStyles.color, rootStyles.color, "#1a1a1a");
		const surface = firstSolidColor(cssVar(rootStyles, "--GBK99A"), cardStyles === null || cardStyles === void 0 ? void 0 : cardStyles.backgroundColor, cssVar(rootStyles, "--GBK10A"), bg);
		const border = firstSolidColor(cssVar(rootStyles, "--GBK08A"), cssVar(rootStyles, "--GBK09A"), cssVar(rootStyles, "--GBK10A"), "rgba(128, 128, 128, 0.22)");
		const primary = firstSolidColor(primaryStyles === null || primaryStyles === void 0 ? void 0 : primaryStyles.backgroundColor, cssVar(rootStyles, "--Brand-1"), cssVar(rootStyles, "--Blue-1"), "#1772f6");
		const primaryText = firstSolidColor(primaryStyles === null || primaryStyles === void 0 ? void 0 : primaryStyles.color, "#ffffff");
		const subtle = firstSolidColor(subtleStyles === null || subtleStyles === void 0 ? void 0 : subtleStyles.backgroundColor, cssVar(rootStyles, "--GBK10A"), cssVar(rootStyles, "--GBK09A"), cssVar(rootStyles, "--GBK01A"), surface, bg);
		const code = firstSolidColor(codeStyles === null || codeStyles === void 0 ? void 0 : codeStyles.backgroundColor, cssVar(rootStyles, "--GBK10A"), cssVar(rootStyles, "--GBK09A"), cssVar(rootStyles, "--GBK01A"), subtle, surface);
		const root = document.documentElement;
		root.style.setProperty("--zhmt-native-bg", bg);
		root.style.setProperty("--zhmt-native-text", text);
		root.style.setProperty("--zhmt-native-surface", surface);
		root.style.setProperty("--zhmt-native-border", border);
		root.style.setProperty("--zhmt-native-primary", primary);
		root.style.setProperty("--zhmt-native-primary-text", primaryText);
		root.style.setProperty("--zh-bg", bg);
		root.style.setProperty("--zh-paper", surface);
		root.style.setProperty("--zh-text", text);
		root.style.setProperty("--zh-title", text);
		root.style.setProperty("--zh-accent", primary);
		root.style.setProperty("--zh-border", border);
		root.style.setProperty("--zh-quote", subtle);
		root.style.setProperty("--zh-code", code);
		root.style.setProperty("--zh-modal-bg", surface);
	}
	function cssVar(styles, name) {
		return styles.getPropertyValue(name).trim() || void 0;
	}
	function firstSolidColor(...values) {
		return values.find((value) => {
			const color = (value || "").trim();
			return color && color !== "transparent" && color !== "rgba(0, 0, 0, 0)";
		});
	}
	var NOISE_SELECTORS = [
		".AppHeader",
		"header.AppHeader",
		"body > div > header",
		".TopNavBar",
		".ColumnPageHeader",
		".Pc-Banner",
		".DownloadAppBanner",
		".Banner",
		".GlobalSideBar-appDownload",
		"[data-za-module=\"TopNavBar\"]",
		".Question-sideColumn",
		".Question-mainColumnLogin",
		".GlobalSideBar",
		".Topstory-sideBar",
		".zhmt-home-side-column",
		".zhmt-home-composer",
		".TopstoryTabs",
		".CreatorEntrance",
		".Footer",
		".CornerButtons"
	];
	var AD_SELECTORS = [
		".Pc-card",
		".Pc-word",
		".Pc-feedAd",
		".Pc-Business-Card-PcTopFeedBanner",
		".AdvertImg",
		".Banner-adTag",
		".KfeCollection-PcCollegeCard",
		".TopstoryItem--advertCard",
		".Card[data-za-module*=\"Advert\"]",
		".ContentItem[data-za-module*=\"Advert\"]",
		"[data-za-detail-view-path-module=\"Ad\"]",
		"[data-za-module*=\"Advertisement\"]",
		"[aria-label*=\"广告\"]",
		"[class*=\"Advert\"]",
		"[class*=\"advert\"]"
	];
	var READABLE_SELECTORS = [
		".AnswerItem",
		".ContentItem.AnswerItem",
		".QuestionAnswer-content",
		".Post-RichText",
		".Post-content",
		".RichContent",
		"article"
	];
	var ANSWER_SELECTORS = [
		".AnswerItem",
		".ContentItem.AnswerItem",
		".QuestionAnswer-content",
		".List-item .ContentItem"
	];
	var COMMENT_SELECTORS = [
		".CommentItem",
		".NestComment",
		".CommentContent"
	];
	var REPLY_SELECTORS = [
		".NestComment",
		".CommentItem--reply",
		".ReplyItem"
	];
	var PROFILE_CONTENT_SELECTORS = [
		".ProfileHeader",
		".Profile-main",
		".ProfileMain",
		".Profile-activities",
		".Card"
	];
	var PROFILE_NOISE_SELECTORS = [
		".AppHeader",
		".Profile-sideColumn",
		".Footer",
		".GlobalSideBar",
		".Pc-Banner",
		".DownloadAppBanner",
		".Sticky",
		"script",
		"style",
		"noscript"
	];
	async function getStoredValue(key, fallback) {
		try {
			if (typeof GM_getValue === "function") {
				const value = await GM_getValue(key, fallback);
				return value === void 0 || value === null ? fallback : value;
			}
		} catch (_unused) {}
		try {
			const raw = window.localStorage.getItem(key);
			return raw ? JSON.parse(raw) : fallback;
		} catch (_unused2) {
			return fallback;
		}
	}
	async function setStoredValue(key, value) {
		try {
			if (typeof GM_setValue === "function") {
				await GM_setValue(key, value);
				return;
			}
		} catch (_unused3) {}
		window.localStorage.setItem(key, JSON.stringify(value));
	}
	function renderLucideIcons(root = document) {
		root.querySelectorAll("[data-lucide]").forEach((placeholder) => {
			const icon = placeholder.dataset.lucide;
			const svg = icon ? icons[icon] : void 0;
			if (!svg) return;
			placeholder.outerHTML = svg;
		});
	}
	var baseAttrs = "width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"";
	var icons = {
		copy: `<svg ${baseAttrs}><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
		"clipboard-copy": `<svg ${baseAttrs}><rect width="8" height="4" x="8" y="2" rx="1"/><path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2"/><path d="M16 4h2a2 2 0 0 1 2 2v4"/><path d="M21 14H11"/><path d="m15 10-4 4 4 4"/></svg>`,
		"chevron-down": `<svg ${baseAttrs}><path d="m6 9 6 6 6-6"/></svg>`,
		"image-down": `<svg ${baseAttrs}><path d="M10.3 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.1-3.1a2 2 0 0 0-2.8 0L6 21"/><path d="M19 16v6"/><path d="m22 19-3 3-3-3"/></svg>`,
		save: `<svg ${baseAttrs}><path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-8H7v8"/><path d="M7 3v5h8"/></svg>`,
		shield: `<svg ${baseAttrs}><path d="M20 13c0 5-3.5 7.5-7.7 8.9a1 1 0 0 1-.6 0C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.2-2.5a1.3 1.3 0 0 1 1.6 0C14.5 3.8 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
		"sun-moon": `<svg ${baseAttrs}><path d="M12 8a2.8 2.8 0 0 0-4 4 2.8 2.8 0 0 0 4-4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.9 4.9 1.4 1.4"/><path d="m17.7 17.7 1.4 1.4"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.3 17.7-1.4 1.4"/><path d="m19.1 4.9-1.4 1.4"/><path d="M20.9 15.1A6.5 6.5 0 0 1 8.9 3.1"/></svg>`,
		"user-round": `<svg ${baseAttrs}><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>`,
		x: `<svg ${baseAttrs}><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`
	};
	var BLOCKLIST_STORAGE_KEY = "zhmt:blocklist-settings";
	var DEFAULT_BLOCKLIST_SETTINGS = {
		keywords: [],
		targets: {
			feed: true,
			answer: true,
			comment: true,
			reply: true
		}
	};
	var targetSelectors = {
		feed: [
			".zhmt-home-feed-item",
			".TopstoryItem",
			".Topstory-recommend .Card",
			".Topstory-mainColumn .Card",
			"#TopstoryContent .ContentItem",
			".Topstory-mainColumn .ContentItem",
			".zhmt-modern-home-main .ContentItem",
			".zhmt-modern-home-main article"
		],
		answer: ANSWER_SELECTORS,
		comment: COMMENT_SELECTORS,
		reply: REPLY_SELECTORS
	};
	var currentSettings = DEFAULT_BLOCKLIST_SETTINGS;
	var onSettingsChangedCallback;
	async function initBlocklist() {
		currentSettings = await loadBlocklistSettings();
		applyBlocklist();
	}
	async function loadBlocklistSettings() {
		return normalizeSettings(await getStoredValue(BLOCKLIST_STORAGE_KEY, DEFAULT_BLOCKLIST_SETTINGS));
	}
	async function saveBlocklistSettings(settings) {
		currentSettings = normalizeSettings(settings);
		await setStoredValue(BLOCKLIST_STORAGE_KEY, currentSettings);
		applyBlocklist();
		if (onSettingsChangedCallback) onSettingsChangedCallback();
	}
	function parseKeywordInput(input) {
		return input.split(/[,，、/\n]/).map((keyword) => keyword.trim()).filter(Boolean);
	}
	function matchesKeyword(text, keywords) {
		const normalizedText = text.toLocaleLowerCase();
		return keywords.some((keyword) => normalizedText.includes(keyword.toLocaleLowerCase()));
	}
	function applyBlocklist(root = document) {
		const settings = currentSettings;
		const keywords = settings.keywords;
		root.querySelectorAll(".zhmt-blocked").forEach((element) => {
			element.classList.remove("zhmt-blocked");
			element.removeAttribute("data-zhmt-blocked");
			element.removeAttribute("aria-hidden");
		});
		if (keywords.length === 0) return 0;
		let blockedCount = 0;
		Object.entries(settings.targets).forEach(([targetName, enabled]) => {
			if (!enabled) return;
			const selectors = targetSelectors[targetName];
			const matchedElements = new Set();
			selectors.forEach((selector) => {
				root.querySelectorAll(selector).forEach((element) => {
					if (matchedElements.has(element) || element.closest(".zhmt-blocked, #zh-tools-panel, .zh-copy-md-container, .zhmt-modal")) return;
					if (!isVisibleElement(element)) return;
					if (matchesKeyword(element.textContent || "", keywords)) {
						matchedElements.add(element);
						element.classList.add("zhmt-blocked");
						element.dataset.zhmtBlocked = targetName;
						element.setAttribute("aria-hidden", "true");
						blockedCount += 1;
					}
				});
			});
		});
		return blockedCount;
	}
	function openBlocklistPanel() {
		const existing = document.querySelector(".zhmt-modal[data-zhmt-modal=\"blocklist\"]");
		if (existing) existing.remove();
		const modal = createElement("section", {
			className: "zhmt-modal zh-modal-overlay",
			attrs: {
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "关键词屏蔽设置",
				"data-zhmt-modal": "blocklist"
			}
		});
		const panel = createElement("div", { className: "zhmt-modal__panel zh-modal zhmt-blocklist-panel" });
		const header = createElement("header", { className: "zhmt-modal__header zh-modal-header" });
		const title = createElement("h2", { text: "关键词屏蔽" });
		const close = createElement("button", {
			className: "zhmt-icon-button zh-modal-close",
			html: "<i data-lucide=\"x\"></i>",
			attrs: {
				type: "button",
				"aria-label": "关闭"
			}
		});
		const form = createElement("form", { className: "zhmt-blocklist-form" });
		const input = createElement("textarea", {
			className: "zhmt-input zhmt-blocklist-input",
			attrs: {
				placeholder: "输入关键词，可用逗号、斜杠或换行分隔",
				rows: "3"
			}
		});
		const add = createElement("button", {
			className: "zhmt-button zhmt-button--primary zh-inline-btn",
			text: "新增",
			attrs: { type: "submit" }
		});
		const targetGroup = createElement("div", { className: "zhmt-toggle-group" });
		const list = createElement("ul", { className: "zhmt-keyword-list" });
		const footer = createElement("footer", { className: "zhmt-modal__footer zh-modal-footer" });
		header.append(title, close);
		form.append(input, add);
		panel.append(header, form, targetGroup, list, footer);
		modal.append(panel);
		document.body.appendChild(modal);
		const render = () => {
			targetGroup.innerHTML = "";
			list.innerHTML = "";
			footer.textContent = `当前共有 ${currentSettings.keywords.length} 个关键词`;
			Object.keys(currentSettings.targets).forEach((target) => {
				const label = createElement("label", { className: "zhmt-checkbox" });
				const checkbox = createElement("input", { attrs: {
					type: "checkbox",
					"data-target": target
				} });
				checkbox.checked = currentSettings.targets[target];
				label.append(checkbox, document.createTextNode(targetLabel(target)));
				targetGroup.appendChild(label);
			});
			currentSettings.keywords.forEach((keyword, index) => {
				const item = createElement("li", { className: "zhmt-keyword-list__item" });
				const text = createElement("span", { text: keyword });
				const actions = createElement("div", { className: "zhmt-keyword-list__actions" });
				const remove = createElement("button", {
					className: "zhmt-ghost-button zh-action-btn zhmt-keyword-delete",
					text: "删除",
					attrs: {
						type: "button",
						"data-index": String(index),
						"aria-label": `删除关键词 ${keyword}`
					}
				});
				actions.appendChild(remove);
				item.append(text, actions);
				list.appendChild(item);
			});
		};
		const showDeleteConfirm = (item, index) => {
			const keyword = currentSettings.keywords[index];
			const actions = item.querySelector(".zhmt-keyword-list__actions");
			if (!actions || !keyword) return;
			actions.replaceChildren(createElement("button", {
				className: "zhmt-button zhmt-button--danger zh-action-btn zhmt-keyword-confirm-delete",
				text: "确认删除",
				attrs: {
					type: "button",
					"data-index": String(index)
				}
			}), createElement("button", {
				className: "zhmt-ghost-button zh-action-btn zhmt-keyword-cancel-delete",
				text: "手滑了",
				attrs: {
					type: "button",
					"data-index": String(index)
				}
			}));
		};
		const closeModal = () => modal.remove();
		close.addEventListener("click", closeModal);
		modal.addEventListener("click", (event) => {
			if (event.target === modal) closeModal();
		});
		form.addEventListener("submit", async (event) => {
			event.preventDefault();
			const incoming = parseKeywordInput(input.value);
			const merged = Array.from(new Set([...incoming, ...currentSettings.keywords]));
			await saveBlocklistSettings({
				...currentSettings,
				keywords: merged
			});
			input.value = "";
			render();
		});
		targetGroup.addEventListener("change", async (event) => {
			const checkbox = event.target;
			const target = checkbox.dataset.target;
			if (!target) return;
			await saveBlocklistSettings({
				...currentSettings,
				targets: {
					...currentSettings.targets,
					[target]: checkbox.checked
				}
			});
			render();
		});
		list.addEventListener("click", async (event) => {
			const button = event.target.closest("button[data-index]");
			if (!button) return;
			const index = Number(button.dataset.index);
			if (button.classList.contains("zhmt-keyword-delete")) {
				const item = button.closest(".zhmt-keyword-list__item");
				if (item) showDeleteConfirm(item, index);
				return;
			}
			if (button.classList.contains("zhmt-keyword-cancel-delete")) {
				render();
				return;
			}
			if (!button.classList.contains("zhmt-keyword-confirm-delete")) return;
			const keywords = currentSettings.keywords.filter((_, keywordIndex) => keywordIndex !== index);
			await saveBlocklistSettings({
				...currentSettings,
				keywords
			});
			render();
		});
		render();
		renderLucideIcons(modal);
		input.focus();
	}
	var debouncedApplyBlocklist = debounce(() => applyBlocklist(), 300);
	function normalizeSettings(settings) {
		return {
			keywords: Array.from(new Set((settings.keywords || []).map((keyword) => keyword.trim()).filter(Boolean))),
			targets: {
				feed: settings.targets && settings.targets.feed !== void 0 ? settings.targets.feed : true,
				answer: settings.targets && settings.targets.answer !== void 0 ? settings.targets.answer : true,
				comment: settings.targets && settings.targets.comment !== void 0 ? settings.targets.comment : true,
				reply: settings.targets && settings.targets.reply !== void 0 ? settings.targets.reply : true
			}
		};
	}
	function targetLabel(target) {
		return {
			feed: "首页推荐",
			answer: "回答",
			comment: "评论",
			reply: "回复"
		}[target];
	}
	var PAGE_CLASS_NAMES = [
		"zhmt-page-home",
		"zhmt-page-question-detail",
		"zhmt-page-post"
	];
	var HOME_LOAD_MORE_SELECTORS = [
		".Topstory button",
		".Topstory-mainColumn button",
		".Topstory-container button",
		"button"
	];
	var HOME_SIDEBAR_TEXT = /大家都在搜|推荐关注|帮助中心|举报中心|关于知乎|付费咨询|知乎知学堂|盐言作者平台|边栏锚点|服务热线|网站资质信息/;
	var HOME_COMPOSER_TEXT = /分享此刻的想法|提问题|写回答|写文章|发视频|同步到圈子/;
	var HOME_FEED_TEXT = /阅读全文|赞同|条评论|收藏|喜欢|分享/;
	var HOME_FEED_CONTAINER_SELECTOR = ".Topstory, .Topstory-container, .Topstory-mainColumn, .Topstory-mainColumnCard, #TopstoryContent, .ListShortcut, .Topstory-recommend, .zhmt-modern-home-main, [data-zhmt-immersive-wrapper=\"true\"].zh-home-wrapper";
	var homeAutoLoader;
	function applyPageCleanup(root = document) {
		markReadableShell();
		hideElementsBySelectors(NOISE_SELECTORS, root);
		hideElementsBySelectors(AD_SELECTORS, root);
		setupHomeFeedAutoLoad();
	}
	function markReadableShell() {
		document.documentElement.classList.add("zhmt-enabled");
		markPageKind();
		markModernHomeShell();
		markReferenceImmersiveShell();
		markHomeFeedItems();
		markHomeFeedControls();
		markQuestionReaderClasses();
		document.querySelectorAll(".Topstory, .Question-main, .Post-main, .Post-Row-Content").forEach((element) => {
			element.classList.add("zhmt-readable-shell");
		});
		document.querySelectorAll(".Topstory-mainColumn, .Question-mainColumn, .Post-Row-Content-left, .Post-content").forEach((element) => {
			element.classList.add("zhmt-readable-main");
		});
	}
	function markReferenceImmersiveShell() {
		document.querySelectorAll(".zhmt-immersive-wrapper").forEach((element) => {
			element.classList.remove("zhmt-immersive-wrapper", "zh-home-wrapper", "zh-home-wide", "zh-question-wrapper");
			element.removeAttribute("data-zhmt-immersive-wrapper");
			if (element.id === "immersive-wrapper") element.removeAttribute("id");
		});
		if (document.documentElement.classList.contains("zhmt-page-home")) {
			markImmersiveElement(document.querySelector(".zhmt-modern-home-main, .Topstory-mainColumn"), ["zh-home-wrapper", "zh-home-wide"]);
			return;
		}
		if (document.documentElement.classList.contains("zhmt-page-question-detail")) {
			const questionShell = ensureQuestionReaderShell();
			if (questionShell) {
				markImmersiveElement(questionShell, ["zh-question-wrapper"]);
				return;
			}
			document.documentElement.classList.add("zhmt-question-shell-pending");
		}
	}
	function ensureQuestionReaderShell() {
		const header = document.querySelector(".QuestionHeader");
		const main = document.querySelector(".Question-main");
		if (!header && !main) return null;
		const sharedParent = header && main ? findSharedQuestionParent(header, main) : void 0;
		if (sharedParent) {
			sharedParent.classList.add("zhmt-question-reader-shell");
			document.documentElement.classList.remove("zhmt-question-shell-pending");
			return sharedParent;
		}
		let shell = document.querySelector(".zhmt-question-reader-shell");
		const headerBlock = header && main ? findQuestionHeaderBlock(header, main) : header;
		const anchor = headerBlock || main;
		const shellParent = anchor === null || anchor === void 0 ? void 0 : anchor.parentElement;
		if (!shell) {
			shell = document.createElement("main");
			shell.className = "zhmt-question-reader-shell";
			shellParent === null || shellParent === void 0 || shellParent.insertBefore(shell, anchor);
		}
		if (headerBlock && headerBlock.parentElement !== shell) shell.appendChild(headerBlock);
		if (main && main.parentElement !== shell) shell.appendChild(main);
		document.documentElement.classList.remove("zhmt-question-shell-pending");
		return shell;
	}
	function findQuestionHeaderBlock(header, main) {
		const headerParent = header.parentElement;
		if (!headerParent || headerParent === document.body || headerParent === document.documentElement) return header;
		if (headerParent.parentElement !== main.parentElement) return header;
		return Array.from(headerParent.children).filter((child) => {
			if (!(child instanceof HTMLElement)) return false;
			return (child.textContent || "").trim().length > 0 && child.getBoundingClientRect().height > 0;
		}).length <= 1 ? headerParent : header;
	}
	function findSharedQuestionParent(header, main) {
		const parent = header.parentElement;
		if (!parent || parent !== main.parentElement || parent === document.body || parent === document.documentElement) return;
		if (Array.from(parent.children).filter((child) => {
			if (!(child instanceof HTMLElement)) return false;
			if (child === header || child === main) return true;
			return (child.textContent || "").trim().length > 0 && child.getBoundingClientRect().height > 0;
		}).length > 4) return;
		return parent;
	}
	function markImmersiveElement(element, classNames) {
		if (!element) return;
		const existing = document.getElementById("immersive-wrapper");
		if (existing && existing !== element) existing.removeAttribute("id");
		if (!element.id) element.id = "immersive-wrapper";
		element.setAttribute("data-zhmt-immersive-wrapper", "true");
		element.classList.add("zhmt-immersive-wrapper", ...classNames);
	}
	function markModernHomeShell() {
		if (!document.documentElement.classList.contains("zhmt-page-home")) return;
		const pageRoot = document.body.querySelector("body > div > div, body > div main, main") || document.body;
		const composer = findElementByText("分享此刻的想法");
		const feedMain = document.querySelector(".Topstory-mainColumn") || findHomeFeedMain(composer);
		if (feedMain) {
			feedMain.classList.add("zhmt-modern-home-main", "zhmt-readable-main");
			markHomeShellAndSidebars(feedMain);
		}
		markHomeSidebarByText();
		markHomeComposer(composer, pageRoot);
	}
	function markPageKind() {
		document.documentElement.classList.remove(...PAGE_CLASS_NAMES);
		if (isHomeRecommendPage()) {
			document.documentElement.classList.add("zhmt-page-home");
			return;
		}
		if (isQuestionDetailPage()) {
			document.documentElement.classList.add("zhmt-page-question-detail");
			return;
		}
		if (isPostPage()) document.documentElement.classList.add("zhmt-page-post");
	}
	function isHomeRecommendPage(url = window.location) {
		return url.hostname.endsWith("zhihu.com") && (url.pathname === "/" || url.pathname === "");
	}
	function isQuestionDetailPage(url = window.location) {
		return url.hostname.endsWith("zhihu.com") && /^\/question\/\d+/.test(url.pathname);
	}
	function isPostPage(url = window.location) {
		return url.hostname === "zhuanlan.zhihu.com" || /^\/p\//.test(url.pathname);
	}
	function setupHomeFeedAutoLoad() {
		if (!isHomeRecommendPage()) {
			if (homeAutoLoader) {
				homeAutoLoader.destroy();
				homeAutoLoader = void 0;
			}
			return;
		}
		if (!homeAutoLoader) {
			homeAutoLoader = createHomeFeedAutoLoader();
			return;
		}
		homeAutoLoader.refresh();
	}
	function markHomeFeedControls() {
		if (!document.documentElement.classList.contains("zhmt-page-home")) return;
		document.querySelectorAll(".Topstory button, .Topstory-mainColumn button, .Topstory-container button, .zhmt-modern-home-main button").forEach((button) => {
			const text = (button.textContent || "").replace(/\s+/g, "");
			if (text.includes("加载更多")) {
				button.classList.add("zhmt-home-load-more");
				return;
			}
			if (text.includes("上一组") || text.includes("下一组") || text.includes("上一页") || text.includes("下一页")) button.classList.add("zhmt-home-pager-control");
		});
	}
	function markHomeFeedItems() {
		if (!document.documentElement.classList.contains("zhmt-page-home")) return;
		document.querySelectorAll(".zhmt-home-feed-item").forEach((element) => {
			element.classList.remove("zhmt-home-feed-item", "zh-home-card");
			element.querySelectorAll(".zh-home-card-title, .zh-home-card-meta, .zh-home-card-snippet, .zh-home-card-type").forEach((child) => child.classList.remove("zh-home-card-title", "zh-home-card-meta", "zh-home-card-snippet", "zh-home-card-type"));
		});
		document.querySelectorAll(".Topstory-mainColumn .TopstoryItem, .zhmt-modern-home-main .TopstoryItem, #TopstoryContent .TopstoryItem, .zhmt-modern-home-main > article, [data-zhmt-immersive-wrapper=\"true\"].zh-home-wrapper > article").forEach((element) => {
			if (!element.classList.contains("zhmt-home-composer") && !element.closest(".zhmt-home-composer")) markHomeFeedItem(element);
		});
		document.querySelectorAll("[data-zhmt-immersive-wrapper=\"true\"].zh-home-wrapper > .Card").forEach((element) => {
			if (!element.classList.contains("WriteArea") && !element.classList.contains("zhmt-home-composer")) markHomeFeedItem(element);
		});
		findModernHomeFeedItems().forEach((element) => {
			markHomeFeedItem(element);
		});
	}
	function markHomeFeedItem(element) {
		element.classList.add("zhmt-home-feed-item", "zh-home-card");
		const title = element.querySelector(".ContentItem-title, .ContentItem-title a, h2, h2 a, a[href*=\"/question/\"], a[href*=\"/answer/\"], a[href*=\"/p/\"]");
		title === null || title === void 0 || title.classList.add("zh-home-card-title");
		const author = element.querySelector(".AuthorInfo, .ContentItem-meta, .ContentItem-author, [class*=\"AuthorInfo\"]");
		author === null || author === void 0 || author.classList.add("zh-home-card-meta");
		const snippet = element.querySelector(".RichContent-inner, .RichText, .ContentItem-excerpt, .RichContent, .ContentItem-time + div");
		snippet === null || snippet === void 0 || snippet.classList.add("zh-home-card-snippet");
		const badgeSource = element.querySelector(".ContentItem-status, .ContentItem-type, [class*=\"ContentItem-status\"]");
		badgeSource === null || badgeSource === void 0 || badgeSource.classList.add("zh-home-card-type");
	}
	function markQuestionReaderClasses() {
		var _document$querySelect;
		if (!document.documentElement.classList.contains("zhmt-page-question-detail")) return;
		const questionHeader = document.querySelector(".QuestionHeader");
		questionHeader === null || questionHeader === void 0 || questionHeader.classList.add("zhmt-question-native-header");
		const title = document.querySelector(".QuestionHeader-title");
		title === null || title === void 0 || title.classList.add("zh-question-title");
		const detail = document.querySelector(".QuestionRichText");
		detail === null || detail === void 0 || detail.classList.add("zh-question-detail-body");
		const detailContainer = (detail === null || detail === void 0 ? void 0 : detail.closest(".QuestionHeader-detail")) || (detail === null || detail === void 0 ? void 0 : detail.parentElement);
		detailContainer === null || detailContainer === void 0 || detailContainer.classList.add("zh-question-detail");
		(_document$querySelect = document.querySelector(".QuestionHeader-footer")) === null || _document$querySelect === void 0 || _document$querySelect.classList.add("zh-question-toolbar");
		document.querySelectorAll(".Question-mainColumn .AnswerCard, .Question-mainColumn .List-item, .QuestionAnswer-content, .AnswerItem").forEach((element) => {
			element.classList.add("zh-question-answer-view");
		});
		document.querySelectorAll(".Question-mainColumn .Card, .Question-mainColumn .List, .Question-mainColumn .AnswerCard").forEach((element) => {
			element.classList.add("zh-question-native-card");
		});
	}
	function createHomeFeedAutoLoader(root = document) {
		const sentinel = ensureHomeFeedSentinel(root);
		let loading = false;
		let releaseTimer;
		const release = () => {
			loading = false;
			releaseTimer = void 0;
		};
		const loadMore = () => {
			if (loading) return false;
			const button = findHomeLoadMoreButton(root);
			if (!button) return false;
			loading = true;
			button.click();
			window.clearTimeout(releaseTimer);
			releaseTimer = window.setTimeout(release, 1200);
			return true;
		};
		const refresh = () => {
			const mainColumn = findHomeFeedContainer(root);
			if (mainColumn && sentinel.parentElement !== mainColumn) mainColumn.appendChild(sentinel);
		};
		const observer = typeof IntersectionObserver === "function" ? new IntersectionObserver((entries) => {
			if (entries.some((entry) => entry.isIntersecting)) loadMore();
		}, { rootMargin: "720px 0px" }) : void 0;
		const onScroll = () => {
			if (sentinel.getBoundingClientRect().top <= window.innerHeight + 720) loadMore();
		};
		const destroy = () => {
			observer === null || observer === void 0 || observer.disconnect();
			window.removeEventListener("scroll", onScroll);
			window.clearTimeout(releaseTimer);
			sentinel.remove();
		};
		refresh();
		if (observer) observer.observe(sentinel);
		else window.addEventListener("scroll", onScroll, { passive: true });
		return {
			sentinel,
			refresh,
			destroy,
			loadMore
		};
	}
	function ensureHomeFeedSentinel(root) {
		const existing = root.querySelector(".zhmt-home-autoload-sentinel");
		if (existing) return existing;
		const sentinel = document.createElement("div");
		sentinel.className = "zhmt-home-autoload-sentinel";
		sentinel.setAttribute("aria-hidden", "true");
		(findHomeFeedContainer(root) || document.body).appendChild(sentinel);
		return sentinel;
	}
	function findHomeFeedContainer(root = document) {
		return root.querySelector("[data-zhmt-immersive-wrapper=\"true\"].zh-home-wrapper, .zhmt-modern-home-main, .Topstory-mainColumn, #TopstoryContent, .Topstory-container, .Topstory");
	}
	function findHomeLoadMoreButton(root = document) {
		const buttons = HOME_LOAD_MORE_SELECTORS.flatMap((selector) => Array.from(root.querySelectorAll(selector)));
		const seen = new Set();
		return buttons.find((button) => {
			if (seen.has(button)) return false;
			seen.add(button);
			return isUsableLoadMoreButton(button);
		});
	}
	function isUsableLoadMoreButton(button) {
		if (button.disabled || button.classList.contains("zhmt-hidden")) return false;
		if (!(button.textContent || "").replace(/\s+/g, "").includes("加载更多")) return false;
		button.classList.add("zhmt-home-load-more");
		return true;
	}
	function findElementByText(text) {
		return Array.from(document.body.querySelectorAll("div, section, span, button, textarea, input")).filter((element) => {
			return (element.textContent || element.getAttribute("placeholder") || "").includes(text);
		}).sort((left, right) => {
			const leftText = left.textContent || left.getAttribute("placeholder") || "";
			const rightText = right.textContent || right.getAttribute("placeholder") || "";
			const leftRect = left.getBoundingClientRect();
			const rightRect = right.getBoundingClientRect();
			const leftRootPenalty = left === document.body || left.id === "root" ? 1e6 : 0;
			const rightRootPenalty = right === document.body || right.id === "root" ? 1e6 : 0;
			const leftArea = leftRect.width * leftRect.height;
			const rightArea = rightRect.width * rightRect.height;
			return leftRootPenalty - rightRootPenalty || leftText.length - rightText.length || leftArea - rightArea;
		})[0];
	}
	function markHomeComposer(composer, pageRoot) {
		document.querySelectorAll(".WriteArea").forEach((element) => {
			var _element$textContent;
			if (((_element$textContent = element.textContent) === null || _element$textContent === void 0 ? void 0 : _element$textContent.includes("分享此刻")) || element.querySelector("textarea, input, button")) {
				element.classList.add("zhmt-home-composer", "zhmt-hidden");
				element.setAttribute("aria-hidden", "true");
			}
		});
		if (!composer) return;
		const composerCard = findComposerAncestor(composer, pageRoot) || findCardLikeAncestor(composer, pageRoot);
		composerCard === null || composerCard === void 0 || composerCard.classList.add("zhmt-home-composer", "zhmt-hidden");
		composerCard === null || composerCard === void 0 || composerCard.setAttribute("aria-hidden", "true");
	}
	function findHomeFeedMain(composer) {
		const candidates = Array.from(document.body.querySelectorAll("main, section, div")).filter((element) => {
			const rect = element.getBoundingClientRect();
			const text = element.textContent || "";
			return rect.width >= 560 && rect.width <= 760 && rect.height > 320 && looksLikeHomeFeedColumn(element, text);
		});
		if (candidates.length > 0) return candidates.sort((left, right) => {
			const leftRect = left.getBoundingClientRect();
			const rightRect = right.getBoundingClientRect();
			return scoreHomeFeedColumn(right) - scoreHomeFeedColumn(left) || Math.abs(leftRect.width - 694) - Math.abs(rightRect.width - 694);
		})[0];
		return composer ? findCardLikeAncestor(composer, document.body) : void 0;
	}
	function markHomeShellAndSidebars(feedMain) {
		let current = feedMain;
		for (let depth = 0; (current === null || current === void 0 ? void 0 : current.parentElement) && current.parentElement !== document.body && depth < 5; depth += 1) {
			const parent = current.parentElement;
			const sidebars = Array.from(parent.children).filter((child) => child instanceof HTMLElement).filter((child) => child !== current && isHomeSidebarColumn(child));
			if (sidebars.length > 0 || parent.classList.contains("Topstory-container")) {
				parent.classList.add("zhmt-modern-home-shell", "zhmt-readable-shell");
				sidebars.forEach((child) => markHomeSidebarColumn(child));
			}
			current = parent;
		}
	}
	function markHomeSidebarByText() {
		Array.from(document.body.querySelectorAll("aside, section, div")).forEach((element) => {
			if (element.closest("[data-zhmt-immersive-wrapper=\"true\"], .zhmt-modern-home-main, .zhmt-home-feed-item, .zhmt-home-composer")) return;
			if (isHomeSidebarColumn(element)) markHomeSidebarColumn(element);
		});
	}
	function markHomeSidebarColumn(element) {
		element.classList.add("zhmt-home-side-column", "zhmt-hidden");
		element.setAttribute("aria-hidden", "true");
	}
	function isHomeSidebarColumn(element) {
		const text = (element.textContent || "").replace(/\s+/g, "");
		if (!HOME_SIDEBAR_TEXT.test(text)) return false;
		const rect = element.getBoundingClientRect();
		const containsFeedSignals = element.querySelector(".ContentItem, .TopstoryItem, article, h2 a[href*=\"/question/\"], h2 a[href*=\"/answer/\"]");
		return (rect.width === 0 || rect.width <= 460 || element.matches("aside, [class*=\"side\"], [class*=\"Side\"]")) && !containsFeedSignals;
	}
	function looksLikeHomeFeedColumn(element, text = element.textContent || "") {
		if (HOME_SIDEBAR_TEXT.test(text) && !HOME_COMPOSER_TEXT.test(text)) return false;
		return element.querySelectorAll(".TopstoryItem, .ContentItem, article, h2").length >= 2 || (HOME_COMPOSER_TEXT.test(text) || HOME_FEED_TEXT.test(text)) && element.querySelectorAll("h2, article, .ContentItem").length >= 1;
	}
	function scoreHomeFeedColumn(element) {
		const rect = element.getBoundingClientRect();
		const text = element.textContent || "";
		const contentScore = Math.min(element.querySelectorAll(".TopstoryItem, .ContentItem, article, h2").length, 12) * 20;
		const composerScore = HOME_COMPOSER_TEXT.test(text) ? 40 : 0;
		const feedScore = HOME_FEED_TEXT.test(text) ? 30 : 0;
		const widthScore = 80 - Math.min(Math.abs(rect.width - 694), 80);
		const sidebarPenalty = HOME_SIDEBAR_TEXT.test(text) ? 80 : 0;
		return contentScore + composerScore + feedScore + widthScore - sidebarPenalty;
	}
	function findModernHomeFeedItems() {
		const feedMain = findHomeFeedContainer();
		if (!feedMain) return [];
		return Array.from(feedMain.querySelectorAll("article, section, div")).filter((element) => {
			if (element.matches(HOME_FEED_CONTAINER_SELECTOR) || element.classList.contains("zhmt-home-composer") || element.classList.contains("zhmt-home-autoload-sentinel") || element.closest(".zhmt-home-composer, .zhmt-home-feed-item, .zhmt-home-side-column, .TopstoryItem")) return false;
			const text = element.textContent || "";
			const rect = element.getBoundingClientRect();
			const hasTitle = !!element.querySelector("h2, .ContentItem-title, a[href*=\"/question/\"], a[href*=\"/answer/\"], a[href*=\"/p/\"]");
			const hasAction = HOME_FEED_TEXT.test(text);
			const isCardSized = rect.width === 0 || rect.width >= 520 && rect.height >= 80;
			const nestedFeedSignals = element.querySelectorAll(".TopstoryItem, article, section, div").length > 6;
			return hasTitle && hasAction && isCardSized && !nestedFeedSignals;
		});
	}
	function findCardLikeAncestor(element, stopAt) {
		let current = element;
		while (current && current.parentElement && current.parentElement !== stopAt) {
			const rect = current.getBoundingClientRect();
			if (rect.width >= 560 && rect.height >= 80) return current;
			current = current.parentElement;
		}
	}
	function findComposerAncestor(element, stopAt) {
		let current = element;
		while (current && current.parentElement && current.parentElement !== stopAt) {
			if (current.classList.contains("WriteArea") || current.classList.contains("Card")) return current;
			const text = current.textContent || "";
			const rect = current.getBoundingClientRect();
			if (text.includes("分享此刻") && rect.width >= 420 && rect.width <= 760 && rect.height >= 60 && rect.height <= 260) return current;
			current = current.parentElement;
		}
	}
	function resolveUrl(url, baseUrl) {
		if (url.match(/^[a-z]+:\/\//i)) return url;
		if (url.match(/^\/\//)) return window.location.protocol + url;
		if (url.match(/^[a-z]+:/i)) return url;
		const doc = document.implementation.createHTMLDocument();
		const base = doc.createElement("base");
		const a = doc.createElement("a");
		doc.head.appendChild(base);
		doc.body.appendChild(a);
		if (baseUrl) base.href = baseUrl;
		a.href = url;
		return a.href;
	}
	var uuid = (() => {
		let counter = 0;
		const random = () => `0000${(Math.random() * 36 ** 4 << 0).toString(36)}`.slice(-4);
		return () => {
			counter += 1;
			return `u${random()}${counter}`;
		};
	})();
	function toArray(arrayLike) {
		const arr = [];
		for (let i = 0, l = arrayLike.length; i < l; i++) arr.push(arrayLike[i]);
		return arr;
	}
	var styleProps = null;
	function getStyleProperties(options = {}) {
		if (styleProps) return styleProps;
		if (options.includeStyleProperties) {
			styleProps = options.includeStyleProperties;
			return styleProps;
		}
		styleProps = toArray(window.getComputedStyle(document.documentElement));
		return styleProps;
	}
	function px(node, styleProperty) {
		const val = (node.ownerDocument.defaultView || window).getComputedStyle(node).getPropertyValue(styleProperty);
		return val ? parseFloat(val.replace("px", "")) : 0;
	}
	function getNodeWidth(node) {
		const leftBorder = px(node, "border-left-width");
		const rightBorder = px(node, "border-right-width");
		return node.clientWidth + leftBorder + rightBorder;
	}
	function getNodeHeight(node) {
		const topBorder = px(node, "border-top-width");
		const bottomBorder = px(node, "border-bottom-width");
		return node.clientHeight + topBorder + bottomBorder;
	}
	function getImageSize(targetNode, options = {}) {
		return {
			width: options.width || getNodeWidth(targetNode),
			height: options.height || getNodeHeight(targetNode)
		};
	}
	function getPixelRatio() {
		let ratio;
		let FINAL_PROCESS;
		try {
			FINAL_PROCESS = process;
		} catch (e) {}
		const val = FINAL_PROCESS && FINAL_PROCESS.env ? FINAL_PROCESS.env.devicePixelRatio : null;
		if (val) {
			ratio = parseInt(val, 10);
			if (Number.isNaN(ratio)) ratio = 1;
		}
		return ratio || window.devicePixelRatio || 1;
	}
	var canvasDimensionLimit = 16384;
	function checkCanvasDimensions(canvas) {
		if (canvas.width > canvasDimensionLimit || canvas.height > canvasDimensionLimit) if (canvas.width > canvasDimensionLimit && canvas.height > canvasDimensionLimit) if (canvas.width > canvas.height) {
			canvas.height *= canvasDimensionLimit / canvas.width;
			canvas.width = canvasDimensionLimit;
		} else {
			canvas.width *= canvasDimensionLimit / canvas.height;
			canvas.height = canvasDimensionLimit;
		}
		else if (canvas.width > canvasDimensionLimit) {
			canvas.height *= canvasDimensionLimit / canvas.width;
			canvas.width = canvasDimensionLimit;
		} else {
			canvas.width *= canvasDimensionLimit / canvas.height;
			canvas.height = canvasDimensionLimit;
		}
	}
	function createImage(url) {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.onload = () => {
				img.decode().then(() => {
					requestAnimationFrame(() => resolve(img));
				});
			};
			img.onerror = reject;
			img.crossOrigin = "anonymous";
			img.decoding = "async";
			img.src = url;
		});
	}
	async function svgToDataURL(svg) {
		return Promise.resolve().then(() => new XMLSerializer().serializeToString(svg)).then(encodeURIComponent).then((html) => `data:image/svg+xml;charset=utf-8,${html}`);
	}
	async function nodeToDataURL(node, width, height) {
		const xmlns = "http://www.w3.org/2000/svg";
		const svg = document.createElementNS(xmlns, "svg");
		const foreignObject = document.createElementNS(xmlns, "foreignObject");
		svg.setAttribute("width", `${width}`);
		svg.setAttribute("height", `${height}`);
		svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
		foreignObject.setAttribute("width", "100%");
		foreignObject.setAttribute("height", "100%");
		foreignObject.setAttribute("x", "0");
		foreignObject.setAttribute("y", "0");
		foreignObject.setAttribute("externalResourcesRequired", "true");
		svg.appendChild(foreignObject);
		foreignObject.appendChild(node);
		return svgToDataURL(svg);
	}
	var isInstanceOfElement = (node, instance) => {
		if (node instanceof instance) return true;
		const nodePrototype = Object.getPrototypeOf(node);
		if (nodePrototype === null) return false;
		return nodePrototype.constructor.name === instance.name || isInstanceOfElement(nodePrototype, instance);
	};
	function formatCSSText(style) {
		const content = style.getPropertyValue("content");
		return `${style.cssText} content: '${content.replace(/'|"/g, "")}';`;
	}
	function formatCSSProperties(style, options) {
		return getStyleProperties(options).map((name) => {
			return `${name}: ${style.getPropertyValue(name)}${style.getPropertyPriority(name) ? " !important" : ""};`;
		}).join(" ");
	}
	function getPseudoElementStyle(className, pseudo, style, options) {
		const selector = `.${className}:${pseudo}`;
		const cssText = style.cssText ? formatCSSText(style) : formatCSSProperties(style, options);
		return document.createTextNode(`${selector}{${cssText}}`);
	}
	function clonePseudoElement(nativeNode, clonedNode, pseudo, options) {
		const style = window.getComputedStyle(nativeNode, pseudo);
		const content = style.getPropertyValue("content");
		if (content === "" || content === "none") return;
		const className = uuid();
		try {
			clonedNode.className = `${clonedNode.className} ${className}`;
		} catch (err) {
			return;
		}
		const styleElement = document.createElement("style");
		styleElement.appendChild(getPseudoElementStyle(className, pseudo, style, options));
		clonedNode.appendChild(styleElement);
	}
	function clonePseudoElements(nativeNode, clonedNode, options) {
		clonePseudoElement(nativeNode, clonedNode, ":before", options);
		clonePseudoElement(nativeNode, clonedNode, ":after", options);
	}
	var WOFF = "application/font-woff";
	var JPEG = "image/jpeg";
	var mimes = {
		woff: WOFF,
		woff2: WOFF,
		ttf: "application/font-truetype",
		eot: "application/vnd.ms-fontobject",
		png: "image/png",
		jpg: JPEG,
		jpeg: JPEG,
		gif: "image/gif",
		tiff: "image/tiff",
		svg: "image/svg+xml",
		webp: "image/webp"
	};
	function getExtension(url) {
		const match = /\.([^./]*?)$/g.exec(url);
		return match ? match[1] : "";
	}
	function getMimeType(url) {
		return mimes[getExtension(url).toLowerCase()] || "";
	}
	function getContentFromDataUrl(dataURL) {
		return dataURL.split(/,/)[1];
	}
	function isDataUrl(url) {
		return url.search(/^(data:)/) !== -1;
	}
	function makeDataUrl(content, mimeType) {
		return `data:${mimeType};base64,${content}`;
	}
	async function fetchAsDataURL(url, init, process) {
		const res = await fetch(url, init);
		if (res.status === 404) throw new Error(`Resource "${res.url}" not found`);
		const blob = await res.blob();
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onerror = reject;
			reader.onloadend = () => {
				try {
					resolve(process({
						res,
						result: reader.result
					}));
				} catch (error) {
					reject(error);
				}
			};
			reader.readAsDataURL(blob);
		});
	}
	var cache = {};
	function getCacheKey(url, contentType, includeQueryParams) {
		let key = url.replace(/\?.*/, "");
		if (includeQueryParams) key = url;
		if (/ttf|otf|eot|woff2?/i.test(key)) key = key.replace(/.*\//, "");
		return contentType ? `[${contentType}]${key}` : key;
	}
	async function resourceToDataURL(resourceUrl, contentType, options) {
		const cacheKey = getCacheKey(resourceUrl, contentType, options.includeQueryParams);
		if (cache[cacheKey] != null) return cache[cacheKey];
		if (options.cacheBust) resourceUrl += (/\?/.test(resourceUrl) ? "&" : "?") + new Date().getTime();
		let dataURL;
		try {
			dataURL = makeDataUrl(await fetchAsDataURL(resourceUrl, options.fetchRequestInit, ({ res, result }) => {
				if (!contentType) contentType = res.headers.get("Content-Type") || "";
				return getContentFromDataUrl(result);
			}), contentType);
		} catch (error) {
			dataURL = options.imagePlaceholder || "";
			let msg = `Failed to fetch resource: ${resourceUrl}`;
			if (error) msg = typeof error === "string" ? error : error.message;
			if (msg) console.warn(msg);
		}
		cache[cacheKey] = dataURL;
		return dataURL;
	}
	async function cloneCanvasElement(canvas) {
		const dataURL = canvas.toDataURL();
		if (dataURL === "data:,") return canvas.cloneNode(false);
		return createImage(dataURL);
	}
	async function cloneVideoElement(video, options) {
		if (video.currentSrc) {
			const canvas = document.createElement("canvas");
			const ctx = canvas.getContext("2d");
			canvas.width = video.clientWidth;
			canvas.height = video.clientHeight;
			ctx === null || ctx === void 0 || ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			return createImage(canvas.toDataURL());
		}
		const poster = video.poster;
		return createImage(await resourceToDataURL(poster, getMimeType(poster), options));
	}
	async function cloneIFrameElement(iframe, options) {
		var _a;
		try {
			if ((_a = iframe === null || iframe === void 0 ? void 0 : iframe.contentDocument) === null || _a === void 0 ? void 0 : _a.body) return await cloneNode(iframe.contentDocument.body, options, true);
		} catch (_b) {}
		return iframe.cloneNode(false);
	}
	async function cloneSingleNode(node, options) {
		if (isInstanceOfElement(node, HTMLCanvasElement)) return cloneCanvasElement(node);
		if (isInstanceOfElement(node, HTMLVideoElement)) return cloneVideoElement(node, options);
		if (isInstanceOfElement(node, HTMLIFrameElement)) return cloneIFrameElement(node, options);
		return node.cloneNode(isSVGElement(node));
	}
	var isSlotElement = (node) => node.tagName != null && node.tagName.toUpperCase() === "SLOT";
	var isSVGElement = (node) => node.tagName != null && node.tagName.toUpperCase() === "SVG";
	async function cloneChildren(nativeNode, clonedNode, options) {
		var _a, _b;
		if (isSVGElement(clonedNode)) return clonedNode;
		let children = [];
		if (isSlotElement(nativeNode) && nativeNode.assignedNodes) children = toArray(nativeNode.assignedNodes());
		else if (isInstanceOfElement(nativeNode, HTMLIFrameElement) && ((_a = nativeNode.contentDocument) === null || _a === void 0 ? void 0 : _a.body)) children = toArray(nativeNode.contentDocument.body.childNodes);
		else children = toArray(((_b = nativeNode.shadowRoot) !== null && _b !== void 0 ? _b : nativeNode).childNodes);
		if (children.length === 0 || isInstanceOfElement(nativeNode, HTMLVideoElement)) return clonedNode;
		await children.reduce((deferred, child) => deferred.then(() => cloneNode(child, options)).then((clonedChild) => {
			if (clonedChild) clonedNode.appendChild(clonedChild);
		}), Promise.resolve());
		return clonedNode;
	}
	function cloneCSSStyle(nativeNode, clonedNode, options) {
		const targetStyle = clonedNode.style;
		if (!targetStyle) return;
		const sourceStyle = window.getComputedStyle(nativeNode);
		if (sourceStyle.cssText) {
			targetStyle.cssText = sourceStyle.cssText;
			targetStyle.transformOrigin = sourceStyle.transformOrigin;
		} else getStyleProperties(options).forEach((name) => {
			let value = sourceStyle.getPropertyValue(name);
			if (name === "font-size" && value.endsWith("px")) value = `${Math.floor(parseFloat(value.substring(0, value.length - 2))) - .1}px`;
			if (isInstanceOfElement(nativeNode, HTMLIFrameElement) && name === "display" && value === "inline") value = "block";
			if (name === "d" && clonedNode.getAttribute("d")) value = `path(${clonedNode.getAttribute("d")})`;
			targetStyle.setProperty(name, value, sourceStyle.getPropertyPriority(name));
		});
	}
	function cloneInputValue(nativeNode, clonedNode) {
		if (isInstanceOfElement(nativeNode, HTMLTextAreaElement)) clonedNode.innerHTML = nativeNode.value;
		if (isInstanceOfElement(nativeNode, HTMLInputElement)) clonedNode.setAttribute("value", nativeNode.value);
	}
	function cloneSelectValue(nativeNode, clonedNode) {
		if (isInstanceOfElement(nativeNode, HTMLSelectElement)) {
			const clonedSelect = clonedNode;
			const selectedOption = Array.from(clonedSelect.children).find((child) => nativeNode.value === child.getAttribute("value"));
			if (selectedOption) selectedOption.setAttribute("selected", "");
		}
	}
	function decorate(nativeNode, clonedNode, options) {
		if (isInstanceOfElement(clonedNode, Element)) {
			cloneCSSStyle(nativeNode, clonedNode, options);
			clonePseudoElements(nativeNode, clonedNode, options);
			cloneInputValue(nativeNode, clonedNode);
			cloneSelectValue(nativeNode, clonedNode);
		}
		return clonedNode;
	}
	async function ensureSVGSymbols(clone, options) {
		const uses = clone.querySelectorAll ? clone.querySelectorAll("use") : [];
		if (uses.length === 0) return clone;
		const processedDefs = {};
		for (let i = 0; i < uses.length; i++) {
			const id = uses[i].getAttribute("xlink:href");
			if (id) {
				const exist = clone.querySelector(id);
				const definition = document.querySelector(id);
				if (!exist && definition && !processedDefs[id]) processedDefs[id] = await cloneNode(definition, options, true);
			}
		}
		const nodes = Object.values(processedDefs);
		if (nodes.length) {
			const ns = "http://www.w3.org/1999/xhtml";
			const svg = document.createElementNS(ns, "svg");
			svg.setAttribute("xmlns", ns);
			svg.style.position = "absolute";
			svg.style.width = "0";
			svg.style.height = "0";
			svg.style.overflow = "hidden";
			svg.style.display = "none";
			const defs = document.createElementNS(ns, "defs");
			svg.appendChild(defs);
			for (let i = 0; i < nodes.length; i++) defs.appendChild(nodes[i]);
			clone.appendChild(svg);
		}
		return clone;
	}
	async function cloneNode(node, options, isRoot) {
		if (!isRoot && options.filter && !options.filter(node)) return null;
		return Promise.resolve(node).then((clonedNode) => cloneSingleNode(clonedNode, options)).then((clonedNode) => cloneChildren(node, clonedNode, options)).then((clonedNode) => decorate(node, clonedNode, options)).then((clonedNode) => ensureSVGSymbols(clonedNode, options));
	}
	var URL_REGEX = /url\((['"]?)([^'"]+?)\1\)/g;
	var URL_WITH_FORMAT_REGEX = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g;
	var FONT_SRC_REGEX = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g;
	function toRegex(url) {
		const escaped = url.replace(/([.*+?^${}()|\[\]\/\\])/g, "\\$1");
		return new RegExp(`(url\\(['"]?)(${escaped})(['"]?\\))`, "g");
	}
	function parseURLs(cssText) {
		const urls = [];
		cssText.replace(URL_REGEX, (raw, quotation, url) => {
			urls.push(url);
			return raw;
		});
		return urls.filter((url) => !isDataUrl(url));
	}
	async function embed(cssText, resourceURL, baseURL, options, getContentFromUrl) {
		try {
			const resolvedURL = baseURL ? resolveUrl(resourceURL, baseURL) : resourceURL;
			const contentType = getMimeType(resourceURL);
			let dataURL;
			if (getContentFromUrl) dataURL = makeDataUrl(await getContentFromUrl(resolvedURL), contentType);
			else dataURL = await resourceToDataURL(resolvedURL, contentType, options);
			return cssText.replace(toRegex(resourceURL), `$1${dataURL}$3`);
		} catch (error) {}
		return cssText;
	}
	function filterPreferredFontFormat(str, { preferredFontFormat }) {
		return !preferredFontFormat ? str : str.replace(FONT_SRC_REGEX, (match) => {
			while (true) {
				const [src, , format] = URL_WITH_FORMAT_REGEX.exec(match) || [];
				if (!format) return "";
				if (format === preferredFontFormat) return `src: ${src};`;
			}
		});
	}
	function shouldEmbed(url) {
		return url.search(URL_REGEX) !== -1;
	}
	async function embedResources(cssText, baseUrl, options) {
		if (!shouldEmbed(cssText)) return cssText;
		const filteredCSSText = filterPreferredFontFormat(cssText, options);
		return parseURLs(filteredCSSText).reduce((deferred, url) => deferred.then((css) => embed(css, url, baseUrl, options)), Promise.resolve(filteredCSSText));
	}
	async function embedProp(propName, node, options) {
		var _a;
		const propValue = (_a = node.style) === null || _a === void 0 ? void 0 : _a.getPropertyValue(propName);
		if (propValue) {
			const cssString = await embedResources(propValue, null, options);
			node.style.setProperty(propName, cssString, node.style.getPropertyPriority(propName));
			return true;
		}
		return false;
	}
	async function embedBackground(clonedNode, options) {
		await embedProp("background", clonedNode, options) || await embedProp("background-image", clonedNode, options);
		await embedProp("mask", clonedNode, options) || await embedProp("-webkit-mask", clonedNode, options) || await embedProp("mask-image", clonedNode, options) || await embedProp("-webkit-mask-image", clonedNode, options);
	}
	async function embedImageNode(clonedNode, options) {
		const isImageElement = isInstanceOfElement(clonedNode, HTMLImageElement);
		if (!(isImageElement && !isDataUrl(clonedNode.src)) && !(isInstanceOfElement(clonedNode, SVGImageElement) && !isDataUrl(clonedNode.href.baseVal))) return;
		const url = isImageElement ? clonedNode.src : clonedNode.href.baseVal;
		const dataURL = await resourceToDataURL(url, getMimeType(url), options);
		await new Promise((resolve, reject) => {
			clonedNode.onload = resolve;
			clonedNode.onerror = options.onImageErrorHandler ? (...attributes) => {
				try {
					resolve(options.onImageErrorHandler(...attributes));
				} catch (error) {
					reject(error);
				}
			} : reject;
			const image = clonedNode;
			if (image.decode) image.decode = resolve;
			if (image.loading === "lazy") image.loading = "eager";
			if (isImageElement) {
				clonedNode.srcset = "";
				clonedNode.src = dataURL;
			} else clonedNode.href.baseVal = dataURL;
		});
	}
	async function embedChildren(clonedNode, options) {
		const deferreds = toArray(clonedNode.childNodes).map((child) => embedImages(child, options));
		await Promise.all(deferreds).then(() => clonedNode);
	}
	async function embedImages(clonedNode, options) {
		if (isInstanceOfElement(clonedNode, Element)) {
			await embedBackground(clonedNode, options);
			await embedImageNode(clonedNode, options);
			await embedChildren(clonedNode, options);
		}
	}
	function applyStyle(node, options) {
		const { style } = node;
		if (options.backgroundColor) style.backgroundColor = options.backgroundColor;
		if (options.width) style.width = `${options.width}px`;
		if (options.height) style.height = `${options.height}px`;
		const manual = options.style;
		if (manual != null) Object.keys(manual).forEach((key) => {
			style[key] = manual[key];
		});
		return node;
	}
	var cssFetchCache = {};
	async function fetchCSS(url) {
		let cache = cssFetchCache[url];
		if (cache != null) return cache;
		cache = {
			url,
			cssText: await (await fetch(url)).text()
		};
		cssFetchCache[url] = cache;
		return cache;
	}
	async function embedFonts(data, options) {
		let cssText = data.cssText;
		const regexUrl = /url\(["']?([^"')]+)["']?\)/g;
		const loadFonts = (cssText.match(/url\([^)]+\)/g) || []).map(async (loc) => {
			let url = loc.replace(regexUrl, "$1");
			if (!url.startsWith("https://")) url = new URL(url, data.url).href;
			return fetchAsDataURL(url, options.fetchRequestInit, ({ result }) => {
				cssText = cssText.replace(loc, `url(${result})`);
				return [loc, result];
			});
		});
		return Promise.all(loadFonts).then(() => cssText);
	}
	function parseCSS(source) {
		if (source == null) return [];
		const result = [];
		let cssText = source.replace(/(\/\*[\s\S]*?\*\/)/gi, "");
		const keyframesRegex = new RegExp("((@.*?keyframes [\\s\\S]*?){([\\s\\S]*?}\\s*?)})", "gi");
		while (true) {
			const matches = keyframesRegex.exec(cssText);
			if (matches === null) break;
			result.push(matches[0]);
		}
		cssText = cssText.replace(keyframesRegex, "");
		const importRegex = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi;
		const unifiedRegex = new RegExp("((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})", "gi");
		while (true) {
			let matches = importRegex.exec(cssText);
			if (matches === null) {
				matches = unifiedRegex.exec(cssText);
				if (matches === null) break;
				else importRegex.lastIndex = unifiedRegex.lastIndex;
			} else unifiedRegex.lastIndex = importRegex.lastIndex;
			result.push(matches[0]);
		}
		return result;
	}
	async function getCSSRules(styleSheets, options) {
		const ret = [];
		const deferreds = [];
		styleSheets.forEach((sheet) => {
			if ("cssRules" in sheet) try {
				toArray(sheet.cssRules || []).forEach((item, index) => {
					if (item.type === CSSRule.IMPORT_RULE) {
						let importIndex = index + 1;
						const url = item.href;
						const deferred = fetchCSS(url).then((metadata) => embedFonts(metadata, options)).then((cssText) => parseCSS(cssText).forEach((rule) => {
							try {
								sheet.insertRule(rule, rule.startsWith("@import") ? importIndex += 1 : sheet.cssRules.length);
							} catch (error) {
								console.error("Error inserting rule from remote css", {
									rule,
									error
								});
							}
						})).catch((e) => {
							console.error("Error loading remote css", e.toString());
						});
						deferreds.push(deferred);
					}
				});
			} catch (e) {
				const inline = styleSheets.find((a) => a.href == null) || document.styleSheets[0];
				if (sheet.href != null) deferreds.push(fetchCSS(sheet.href).then((metadata) => embedFonts(metadata, options)).then((cssText) => parseCSS(cssText).forEach((rule) => {
					inline.insertRule(rule, inline.cssRules.length);
				})).catch((err) => {
					console.error("Error loading remote stylesheet", err);
				}));
				console.error("Error inlining remote css file", e);
			}
		});
		return Promise.all(deferreds).then(() => {
			styleSheets.forEach((sheet) => {
				if ("cssRules" in sheet) try {
					toArray(sheet.cssRules || []).forEach((item) => {
						ret.push(item);
					});
				} catch (e) {
					console.error(`Error while reading CSS rules from ${sheet.href}`, e);
				}
			});
			return ret;
		});
	}
	function getWebFontRules(cssRules) {
		return cssRules.filter((rule) => rule.type === CSSRule.FONT_FACE_RULE).filter((rule) => shouldEmbed(rule.style.getPropertyValue("src")));
	}
	async function parseWebFontRules(node, options) {
		if (node.ownerDocument == null) throw new Error("Provided element is not within a Document");
		return getWebFontRules(await getCSSRules(toArray(node.ownerDocument.styleSheets), options));
	}
	function normalizeFontFamily(font) {
		return font.trim().replace(/["']/g, "");
	}
	function getUsedFonts(node) {
		const fonts = new Set();
		function traverse(node) {
			(node.style.fontFamily || getComputedStyle(node).fontFamily).split(",").forEach((font) => {
				fonts.add(normalizeFontFamily(font));
			});
			Array.from(node.children).forEach((child) => {
				if (child instanceof HTMLElement) traverse(child);
			});
		}
		traverse(node);
		return fonts;
	}
	async function getWebFontCSS(node, options) {
		const rules = await parseWebFontRules(node, options);
		const usedFonts = getUsedFonts(node);
		return (await Promise.all(rules.filter((rule) => usedFonts.has(normalizeFontFamily(rule.style.fontFamily))).map((rule) => {
			const baseUrl = rule.parentStyleSheet ? rule.parentStyleSheet.href : null;
			return embedResources(rule.cssText, baseUrl, options);
		}))).join("\n");
	}
	async function embedWebFonts(clonedNode, options) {
		const cssText = options.fontEmbedCSS != null ? options.fontEmbedCSS : options.skipFonts ? null : await getWebFontCSS(clonedNode, options);
		if (cssText) {
			const styleNode = document.createElement("style");
			const sytleContent = document.createTextNode(cssText);
			styleNode.appendChild(sytleContent);
			if (clonedNode.firstChild) clonedNode.insertBefore(styleNode, clonedNode.firstChild);
			else clonedNode.appendChild(styleNode);
		}
	}
	async function toSvg(node, options = {}) {
		const { width, height } = getImageSize(node, options);
		const clonedNode = await cloneNode(node, options, true);
		await embedWebFonts(clonedNode, options);
		await embedImages(clonedNode, options);
		applyStyle(clonedNode, options);
		return await nodeToDataURL(clonedNode, width, height);
	}
	async function toCanvas(node, options = {}) {
		const { width, height } = getImageSize(node, options);
		const img = await createImage(await toSvg(node, options));
		const canvas = document.createElement("canvas");
		const context = canvas.getContext("2d");
		const ratio = options.pixelRatio || getPixelRatio();
		const canvasWidth = options.canvasWidth || width;
		const canvasHeight = options.canvasHeight || height;
		canvas.width = canvasWidth * ratio;
		canvas.height = canvasHeight * ratio;
		if (!options.skipAutoScale) checkCanvasDimensions(canvas);
		canvas.style.width = `${canvasWidth}`;
		canvas.style.height = `${canvasHeight}`;
		if (options.backgroundColor) {
			context.fillStyle = options.backgroundColor;
			context.fillRect(0, 0, canvas.width, canvas.height);
		}
		context.drawImage(img, 0, 0, canvas.width, canvas.height);
		return canvas;
	}
	async function toPng(node, options = {}) {
		return (await toCanvas(node, options)).toDataURL();
	}
	function downloadTextFile(filename, content, type = "text/plain;charset=utf-8") {
		downloadBlob(filename, new Blob([content], { type }));
	}
	function downloadBlob(filename, blob) {
		const url = URL.createObjectURL(blob);
		try {
			if (typeof GM_download === "function") {
				GM_download({
					url,
					name: filename,
					saveAs: true,
					onload: () => URL.revokeObjectURL(url),
					onerror: () => {
						URL.revokeObjectURL(url);
						anchorDownload(filename, blob);
					}
				});
				return;
			}
			anchorDownload(filename, blob);
		} catch (_unused) {
			URL.revokeObjectURL(url);
			anchorDownload(filename, blob);
		}
	}
	async function copyText(text) {
		if (navigator.clipboard && navigator.clipboard.writeText) try {
			await navigator.clipboard.writeText(text);
			return;
		} catch (_unused2) {}
		if (typeof GM_setClipboard === "function") {
			GM_setClipboard(text, "text");
			return;
		}
		const textarea = document.createElement("textarea");
		textarea.value = text;
		textarea.style.position = "fixed";
		textarea.style.left = "-9999px";
		document.body.appendChild(textarea);
		textarea.select();
		document.execCommand("copy");
		textarea.remove();
	}
	function anchorDownload(filename, blob) {
		const url = URL.createObjectURL(blob);
		const anchor = document.createElement("a");
		anchor.href = url;
		anchor.download = filename;
		anchor.rel = "noreferrer";
		document.body.appendChild(anchor);
		anchor.click();
		anchor.remove();
		window.setTimeout(() => URL.revokeObjectURL(url), 1e3);
	}
	function extend(destination) {
		for (var i = 1; i < arguments.length; i++) {
			var source = arguments[i];
			for (var key in source) if (Object.prototype.hasOwnProperty.call(source, key)) destination[key] = source[key];
		}
		return destination;
	}
	function repeat(character, count) {
		return Array(count + 1).join(character);
	}
	function trimLeadingNewlines(string) {
		return string.replace(/^\n*/, "");
	}
	function trimTrailingNewlines(string) {
		var indexEnd = string.length;
		while (indexEnd > 0 && string[indexEnd - 1] === "\n") indexEnd--;
		return string.substring(0, indexEnd);
	}
	function trimNewlines(string) {
		return trimTrailingNewlines(trimLeadingNewlines(string));
	}
	var blockElements = [
		"ADDRESS",
		"ARTICLE",
		"ASIDE",
		"AUDIO",
		"BLOCKQUOTE",
		"BODY",
		"CANVAS",
		"CENTER",
		"DD",
		"DIR",
		"DIV",
		"DL",
		"DT",
		"FIELDSET",
		"FIGCAPTION",
		"FIGURE",
		"FOOTER",
		"FORM",
		"FRAMESET",
		"H1",
		"H2",
		"H3",
		"H4",
		"H5",
		"H6",
		"HEADER",
		"HGROUP",
		"HR",
		"HTML",
		"ISINDEX",
		"LI",
		"MAIN",
		"MENU",
		"NAV",
		"NOFRAMES",
		"NOSCRIPT",
		"OL",
		"OUTPUT",
		"P",
		"PRE",
		"SECTION",
		"TABLE",
		"TBODY",
		"TD",
		"TFOOT",
		"TH",
		"THEAD",
		"TR",
		"UL"
	];
	function isBlock(node) {
		return is(node, blockElements);
	}
	var voidElements = [
		"AREA",
		"BASE",
		"BR",
		"COL",
		"COMMAND",
		"EMBED",
		"HR",
		"IMG",
		"INPUT",
		"KEYGEN",
		"LINK",
		"META",
		"PARAM",
		"SOURCE",
		"TRACK",
		"WBR"
	];
	function isVoid(node) {
		return is(node, voidElements);
	}
	function hasVoid(node) {
		return has(node, voidElements);
	}
	var meaningfulWhenBlankElements = [
		"A",
		"TABLE",
		"THEAD",
		"TBODY",
		"TFOOT",
		"TH",
		"TD",
		"IFRAME",
		"SCRIPT",
		"AUDIO",
		"VIDEO"
	];
	function isMeaningfulWhenBlank(node) {
		return is(node, meaningfulWhenBlankElements);
	}
	function hasMeaningfulWhenBlank(node) {
		return has(node, meaningfulWhenBlankElements);
	}
	function is(node, tagNames) {
		return tagNames.indexOf(node.nodeName) >= 0;
	}
	function has(node, tagNames) {
		return node.getElementsByTagName && tagNames.some(function(tagName) {
			return node.getElementsByTagName(tagName).length;
		});
	}
	var markdownEscapes = [
		[/\\/g, "\\\\"],
		[/\*/g, "\\*"],
		[/^-/g, "\\-"],
		[/^\+ /g, "\\+ "],
		[/^(=+)/g, "\\$1"],
		[/^(#{1,6}) /g, "\\$1 "],
		[/`/g, "\\`"],
		[/^~~~/g, "\\~~~"],
		[/\[/g, "\\["],
		[/\]/g, "\\]"],
		[/^>/g, "\\>"],
		[/_/g, "\\_"],
		[/^(\d+)\. /g, "$1\\. "]
	];
	function escapeMarkdown(string) {
		return markdownEscapes.reduce(function(accumulator, escape) {
			return accumulator.replace(escape[0], escape[1]);
		}, string);
	}
	var rules = {};
	rules.paragraph = {
		filter: "p",
		replacement: function(content) {
			return "\n\n" + content + "\n\n";
		}
	};
	rules.lineBreak = {
		filter: "br",
		replacement: function(content, node, options) {
			return options.br + "\n";
		}
	};
	rules.heading = {
		filter: [
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6"
		],
		replacement: function(content, node, options) {
			var hLevel = Number(node.nodeName.charAt(1));
			if (options.headingStyle === "setext" && hLevel < 3) {
				var underline = repeat(hLevel === 1 ? "=" : "-", content.length);
				return "\n\n" + content + "\n" + underline + "\n\n";
			} else return "\n\n" + repeat("#", hLevel) + " " + content + "\n\n";
		}
	};
	rules.blockquote = {
		filter: "blockquote",
		replacement: function(content) {
			content = trimNewlines(content).replace(/^/gm, "> ");
			return "\n\n" + content + "\n\n";
		}
	};
	rules.list = {
		filter: ["ul", "ol"],
		replacement: function(content, node) {
			var parent = node.parentNode;
			if (parent.nodeName === "LI" && parent.lastElementChild === node) return "\n" + content;
			else return "\n\n" + content + "\n\n";
		}
	};
	rules.listItem = {
		filter: "li",
		replacement: function(content, node, options) {
			var prefix = options.bulletListMarker + "   ";
			var parent = node.parentNode;
			if (parent.nodeName === "OL") {
				var start = parent.getAttribute("start");
				var index = Array.prototype.indexOf.call(parent.children, node);
				prefix = (start ? Number(start) + index : index + 1) + ".  ";
			}
			var isParagraph = /\n$/.test(content);
			content = trimNewlines(content) + (isParagraph ? "\n" : "");
			content = content.replace(/\n/gm, "\n" + " ".repeat(prefix.length));
			return prefix + content + (node.nextSibling ? "\n" : "");
		}
	};
	rules.indentedCodeBlock = {
		filter: function(node, options) {
			return options.codeBlockStyle === "indented" && node.nodeName === "PRE" && node.firstChild && node.firstChild.nodeName === "CODE";
		},
		replacement: function(content, node, options) {
			return "\n\n    " + node.firstChild.textContent.replace(/\n/g, "\n    ") + "\n\n";
		}
	};
	rules.fencedCodeBlock = {
		filter: function(node, options) {
			return options.codeBlockStyle === "fenced" && node.nodeName === "PRE" && node.firstChild && node.firstChild.nodeName === "CODE";
		},
		replacement: function(content, node, options) {
			var language = ((node.firstChild.getAttribute("class") || "").match(/language-(\S+)/) || [null, ""])[1];
			var code = node.firstChild.textContent;
			var fenceChar = options.fence.charAt(0);
			var fenceSize = 3;
			var fenceInCodeRegex = new RegExp("^" + fenceChar + "{3,}", "gm");
			var match;
			while (match = fenceInCodeRegex.exec(code)) if (match[0].length >= fenceSize) fenceSize = match[0].length + 1;
			var fence = repeat(fenceChar, fenceSize);
			return "\n\n" + fence + language + "\n" + code.replace(/\n$/, "") + "\n" + fence + "\n\n";
		}
	};
	rules.horizontalRule = {
		filter: "hr",
		replacement: function(content, node, options) {
			return "\n\n" + options.hr + "\n\n";
		}
	};
	rules.inlineLink = {
		filter: function(node, options) {
			return options.linkStyle === "inlined" && node.nodeName === "A" && node.getAttribute("href");
		},
		replacement: function(content, node) {
			var href = escapeLinkDestination(node.getAttribute("href"));
			var title = escapeLinkTitle(cleanAttribute(node.getAttribute("title")));
			var titlePart = title ? " \"" + title + "\"" : "";
			return "[" + content + "](" + href + titlePart + ")";
		}
	};
	rules.referenceLink = {
		filter: function(node, options) {
			return options.linkStyle === "referenced" && node.nodeName === "A" && node.getAttribute("href");
		},
		replacement: function(content, node, options) {
			var href = escapeLinkDestination(node.getAttribute("href"));
			var title = cleanAttribute(node.getAttribute("title"));
			if (title) title = " \"" + escapeLinkTitle(title) + "\"";
			var replacement;
			var reference;
			switch (options.linkReferenceStyle) {
				case "collapsed":
					replacement = "[" + content + "][]";
					reference = "[" + content + "]: " + href + title;
					break;
				case "shortcut":
					replacement = "[" + content + "]";
					reference = "[" + content + "]: " + href + title;
					break;
				default:
					var id = this.references.length + 1;
					replacement = "[" + content + "][" + id + "]";
					reference = "[" + id + "]: " + href + title;
			}
			this.references.push(reference);
			return replacement;
		},
		references: [],
		append: function(options) {
			var references = "";
			if (this.references.length) {
				references = "\n\n" + this.references.join("\n") + "\n\n";
				this.references = [];
			}
			return references;
		}
	};
	rules.emphasis = {
		filter: ["em", "i"],
		replacement: function(content, node, options) {
			if (!content.trim()) return "";
			return options.emDelimiter + content + options.emDelimiter;
		}
	};
	rules.strong = {
		filter: ["strong", "b"],
		replacement: function(content, node, options) {
			if (!content.trim()) return "";
			return options.strongDelimiter + content + options.strongDelimiter;
		}
	};
	rules.code = {
		filter: function(node) {
			var hasSiblings = node.previousSibling || node.nextSibling;
			var isCodeBlock = node.parentNode.nodeName === "PRE" && !hasSiblings;
			return node.nodeName === "CODE" && !isCodeBlock;
		},
		replacement: function(content) {
			if (!content) return "";
			content = content.replace(/\r?\n|\r/g, " ");
			var extraSpace = /^`|^ .*?[^ ].* $|`$/.test(content) ? " " : "";
			var delimiter = "`";
			var matches = content.match(/`+/gm) || [];
			while (matches.indexOf(delimiter) !== -1) delimiter = delimiter + "`";
			return delimiter + extraSpace + content + extraSpace + delimiter;
		}
	};
	rules.image = {
		filter: "img",
		replacement: function(content, node) {
			var alt = escapeMarkdown(cleanAttribute(node.getAttribute("alt")));
			var src = escapeLinkDestination(node.getAttribute("src") || "");
			var title = cleanAttribute(node.getAttribute("title"));
			var titlePart = title ? " \"" + escapeLinkTitle(title) + "\"" : "";
			return src ? "![" + alt + "](" + src + titlePart + ")" : "";
		}
	};
	function cleanAttribute(attribute) {
		return attribute ? attribute.replace(/(\n+\s*)+/g, "\n") : "";
	}
	function escapeLinkDestination(destination) {
		var escaped = destination.replace(/([<>()])/g, "\\$1");
		return escaped.indexOf(" ") >= 0 ? "<" + escaped + ">" : escaped;
	}
	function escapeLinkTitle(title) {
		return title.replace(/"/g, "\\\"");
	}
	function Rules(options) {
		this.options = options;
		this._keep = [];
		this._remove = [];
		this.blankRule = { replacement: options.blankReplacement };
		this.keepReplacement = options.keepReplacement;
		this.defaultRule = { replacement: options.defaultReplacement };
		this.array = [];
		for (var key in options.rules) this.array.push(options.rules[key]);
	}
	Rules.prototype = {
		add: function(key, rule) {
			this.array.unshift(rule);
		},
		keep: function(filter) {
			this._keep.unshift({
				filter,
				replacement: this.keepReplacement
			});
		},
		remove: function(filter) {
			this._remove.unshift({
				filter,
				replacement: function() {
					return "";
				}
			});
		},
		forNode: function(node) {
			if (node.isBlank) return this.blankRule;
			var rule;
			if (rule = findRule(this.array, node, this.options)) return rule;
			if (rule = findRule(this._keep, node, this.options)) return rule;
			if (rule = findRule(this._remove, node, this.options)) return rule;
			return this.defaultRule;
		},
		forEach: function(fn) {
			for (var i = 0; i < this.array.length; i++) fn(this.array[i], i);
		}
	};
	function findRule(rules, node, options) {
		for (var i = 0; i < rules.length; i++) {
			var rule = rules[i];
			if (filterValue(rule, node, options)) return rule;
		}
	}
	function filterValue(rule, node, options) {
		var filter = rule.filter;
		if (typeof filter === "string") {
			if (filter === node.nodeName.toLowerCase()) return true;
		} else if (Array.isArray(filter)) {
			if (filter.indexOf(node.nodeName.toLowerCase()) > -1) return true;
		} else if (typeof filter === "function") {
			if (filter.call(rule, node, options)) return true;
		} else throw new TypeError("`filter` needs to be a string, array, or function");
	}
	function collapseWhitespace(options) {
		var element = options.element;
		var isBlock = options.isBlock;
		var isVoid = options.isVoid;
		var isPre = options.isPre || function(node) {
			return node.nodeName === "PRE";
		};
		if (!element.firstChild || isPre(element)) return;
		var prevText = null;
		var keepLeadingWs = false;
		var prev = null;
		var node = next(prev, element, isPre);
		while (node !== element) {
			if (node.nodeType === 3 || node.nodeType === 4) {
				var text = node.data.replace(/[ \r\n\t]+/g, " ");
				if ((!prevText || / $/.test(prevText.data)) && !keepLeadingWs && text[0] === " ") text = text.substr(1);
				if (!text) {
					node = remove(node);
					continue;
				}
				node.data = text;
				prevText = node;
			} else if (node.nodeType === 1) {
				if (isBlock(node) || node.nodeName === "BR") {
					if (prevText) prevText.data = prevText.data.replace(/ $/, "");
					prevText = null;
					keepLeadingWs = false;
				} else if (isVoid(node) || isPre(node)) {
					prevText = null;
					keepLeadingWs = true;
				} else if (prevText) keepLeadingWs = false;
			} else {
				node = remove(node);
				continue;
			}
			var nextNode = next(prev, node, isPre);
			prev = node;
			node = nextNode;
		}
		if (prevText) {
			prevText.data = prevText.data.replace(/ $/, "");
			if (!prevText.data) remove(prevText);
		}
	}
	function remove(node) {
		var next = node.nextSibling || node.parentNode;
		node.parentNode.removeChild(node);
		return next;
	}
	function next(prev, current, isPre) {
		if (prev && prev.parentNode === current || isPre(current)) return current.nextSibling || current.parentNode;
		return current.firstChild || current.nextSibling || current.parentNode;
	}
	var root = typeof window !== "undefined" ? window : {};
	function canParseHTMLNatively() {
		var Parser = root.DOMParser;
		var canParse = false;
		try {
			if (new Parser().parseFromString("", "text/html")) canParse = true;
		} catch (e) {}
		return canParse;
	}
	function createHTMLParser() {
		var Parser = function() {};
		if (shouldUseActiveX()) Parser.prototype.parseFromString = function(string) {
			var doc = new window.ActiveXObject("htmlfile");
			doc.designMode = "on";
			doc.open();
			doc.write(string);
			doc.close();
			return doc;
		};
		else Parser.prototype.parseFromString = function(string) {
			var doc = document.implementation.createHTMLDocument("");
			doc.open();
			doc.write(string);
			doc.close();
			return doc;
		};
		return Parser;
	}
	function shouldUseActiveX() {
		var useActiveX = false;
		try {
			document.implementation.createHTMLDocument("").open();
		} catch (e) {
			if (root.ActiveXObject) useActiveX = true;
		}
		return useActiveX;
	}
	var HTMLParser = canParseHTMLNatively() ? root.DOMParser : createHTMLParser();
	function RootNode(input, options) {
		var root;
		if (typeof input === "string") root = htmlParser().parseFromString("<x-turndown id=\"turndown-root\">" + input + "</x-turndown>", "text/html").getElementById("turndown-root");
		else root = input.cloneNode(true);
		collapseWhitespace({
			element: root,
			isBlock,
			isVoid,
			isPre: options.preformattedCode ? isPreOrCode : null
		});
		return root;
	}
	var _htmlParser;
	function htmlParser() {
		_htmlParser = _htmlParser || new HTMLParser();
		return _htmlParser;
	}
	function isPreOrCode(node) {
		return node.nodeName === "PRE" || node.nodeName === "CODE";
	}
	function Node$1(node, options) {
		node.isBlock = isBlock(node);
		node.isCode = node.nodeName === "CODE" || node.parentNode.isCode;
		node.isBlank = isBlank(node);
		node.flankingWhitespace = flankingWhitespace(node, options);
		return node;
	}
	function isBlank(node) {
		return !isVoid(node) && !isMeaningfulWhenBlank(node) && /^\s*$/i.test(node.textContent) && !hasVoid(node) && !hasMeaningfulWhenBlank(node);
	}
	function flankingWhitespace(node, options) {
		if (node.isBlock || options.preformattedCode && node.isCode) return {
			leading: "",
			trailing: ""
		};
		var edges = edgeWhitespace(node.textContent);
		if (edges.leadingAscii && isFlankedByWhitespace("left", node, options)) edges.leading = edges.leadingNonAscii;
		if (edges.trailingAscii && isFlankedByWhitespace("right", node, options)) edges.trailing = edges.trailingNonAscii;
		return {
			leading: edges.leading,
			trailing: edges.trailing
		};
	}
	function edgeWhitespace(string) {
		var m = string.match(/^(([ \t\r\n]*)(\s*))(?:(?=\S)[\s\S]*\S)?((\s*?)([ \t\r\n]*))$/);
		return {
			leading: m[1],
			leadingAscii: m[2],
			leadingNonAscii: m[3],
			trailing: m[4],
			trailingNonAscii: m[5],
			trailingAscii: m[6]
		};
	}
	function isFlankedByWhitespace(side, node, options) {
		var sibling;
		var regExp;
		var isFlanked;
		if (side === "left") {
			sibling = node.previousSibling;
			regExp = / $/;
		} else {
			sibling = node.nextSibling;
			regExp = /^ /;
		}
		if (sibling) {
			if (sibling.nodeType === 3) isFlanked = regExp.test(sibling.nodeValue);
			else if (options.preformattedCode && sibling.nodeName === "CODE") isFlanked = false;
			else if (sibling.nodeType === 1 && !isBlock(sibling)) isFlanked = regExp.test(sibling.textContent);
		}
		return isFlanked;
	}
	var reduce = Array.prototype.reduce;
	function TurndownService(options) {
		if (!(this instanceof TurndownService)) return new TurndownService(options);
		var defaults = {
			rules,
			headingStyle: "setext",
			hr: "* * *",
			bulletListMarker: "*",
			codeBlockStyle: "indented",
			fence: "```",
			emDelimiter: "_",
			strongDelimiter: "**",
			linkStyle: "inlined",
			linkReferenceStyle: "full",
			br: "  ",
			preformattedCode: false,
			blankReplacement: function(content, node) {
				return node.isBlock ? "\n\n" : "";
			},
			keepReplacement: function(content, node) {
				return node.isBlock ? "\n\n" + node.outerHTML + "\n\n" : node.outerHTML;
			},
			defaultReplacement: function(content, node) {
				return node.isBlock ? "\n\n" + content + "\n\n" : content;
			}
		};
		this.options = extend({}, defaults, options);
		this.rules = new Rules(this.options);
	}
	TurndownService.prototype = {
		turndown: function(input) {
			if (!canConvert(input)) throw new TypeError(input + " is not a string, or an element/document/fragment node.");
			if (input === "") return "";
			var output = process$1.call(this, new RootNode(input, this.options));
			return postProcess.call(this, output);
		},
		use: function(plugin) {
			if (Array.isArray(plugin)) for (var i = 0; i < plugin.length; i++) this.use(plugin[i]);
			else if (typeof plugin === "function") plugin(this);
			else throw new TypeError("plugin must be a Function or an Array of Functions");
			return this;
		},
		addRule: function(key, rule) {
			this.rules.add(key, rule);
			return this;
		},
		keep: function(filter) {
			this.rules.keep(filter);
			return this;
		},
		remove: function(filter) {
			this.rules.remove(filter);
			return this;
		},
		escape: function(string) {
			return escapeMarkdown(string);
		}
	};
	function process$1(parentNode) {
		var self = this;
		return reduce.call(parentNode.childNodes, function(output, node) {
			node = new Node$1(node, self.options);
			var replacement = "";
			if (node.nodeType === 3) replacement = node.isCode ? node.nodeValue : self.escape(node.nodeValue);
			else if (node.nodeType === 1) replacement = replacementForNode.call(self, node);
			return join(output, replacement);
		}, "");
	}
	function postProcess(output) {
		var self = this;
		this.rules.forEach(function(rule) {
			if (typeof rule.append === "function") output = join(output, rule.append(self.options));
		});
		return output.replace(/^[\t\r\n]+/, "").replace(/[\t\r\n\s]+$/, "");
	}
	function replacementForNode(node) {
		var rule = this.rules.forNode(node);
		var content = process$1.call(this, node);
		var whitespace = node.flankingWhitespace;
		if (whitespace.leading || whitespace.trailing) content = content.trim();
		return whitespace.leading + rule.replacement(content, node, this.options) + whitespace.trailing;
	}
	function join(output, replacement) {
		var s1 = trimTrailingNewlines(output);
		var s2 = trimLeadingNewlines(replacement);
		var nls = Math.max(output.length - s1.length, replacement.length - s2.length);
		return s1 + "\n\n".substring(0, nls) + s2;
	}
	function canConvert(input) {
		return input != null && (typeof input === "string" || input.nodeType && (input.nodeType === 1 || input.nodeType === 9 || input.nodeType === 11));
	}
	function buildMarkdown(content) {
		const cloned = content.element.cloneNode(true);
		cloned.querySelectorAll("script, style, noscript, .zhmt-toolbar, .zhmt-modal").forEach((element) => element.remove());
		const body = createTurndownService().turndown(cloned.innerHTML).trim();
		return [
			`# ${content.title}`,
			"",
			`> 作者：${content.author}`,
			`> 来源：${content.url}`,
			"",
			body
		].join("\n");
	}
	function createTurndownService() {
		const turndown = new TurndownService({
			headingStyle: "atx",
			bulletListMarker: "-",
			codeBlockStyle: "fenced",
			emDelimiter: "*"
		});
		turndown.addRule("zhihuImages", {
			filter: "img",
			replacement: (_content, node) => {
				const image = node;
				const src = image.currentSrc || image.src || image.getAttribute("data-original") || image.getAttribute("data-actualsrc");
				const alt = image.alt || "image";
				return src ? `![${alt}](${src})` : "";
			}
		});
		turndown.addRule("lineBreaks", {
			filter: "br",
			replacement: () => "\n"
		});
		return turndown;
	}
	function findCurrentReadableContent() {
		const element = findReadableElement();
		if (!element) return;
		return {
			element,
			title: getTitle(),
			author: getAuthor(element),
			url: window.location.href
		};
	}
	function findReadableElement(root = document) {
		const visibleCandidates = READABLE_SELECTORS.flatMap((selector) => Array.from(root.querySelectorAll(selector))).filter(isVisibleElement);
		if (visibleCandidates.length === 0) return;
		const viewportMiddle = window.innerHeight / 2;
		const selected = visibleCandidates.map((element) => ({
			element,
			distance: Math.abs(element.getBoundingClientRect().top - viewportMiddle),
			area: element.getBoundingClientRect().width * element.getBoundingClientRect().height
		})).sort((left, right) => left.distance - right.distance || right.area - left.area)[0];
		return selected ? selected.element : void 0;
	}
	function getTitle() {
		const titleElement = document.querySelector(".QuestionHeader-title, .Post-Title, h1, .ContentItem-title");
		return cleanZhihuTitle((titleElement && titleElement.textContent ? titleElement.textContent.trim() : "") || document.title.replace(/ - 知乎$/, "").trim()) || "知乎内容";
	}
	function cleanZhihuTitle(title) {
		return title.replace(/^[（(]\d+\s*条消息[)）]\s*/, "").trim();
	}
	function getAuthor(root = document) {
		const authorElement = root.querySelector(".AuthorInfo-name, .UserLink-link, .AuthorInfo .Popover a, .Post-Author .UserLink-link");
		return (authorElement && authorElement.textContent ? authorElement.textContent.trim() : "") || "知乎用户";
	}
	function buildOfflineHtml(content) {
		const cloned = content.element.cloneNode(true);
		cloned.querySelectorAll("script, style, noscript, .zhmt-toolbar, .zhmt-modal").forEach((element) => element.remove());
		return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(content.title)}</title>
  <style>
    body {
      max-width: 760px;
      margin: 32px auto;
      padding: 0 20px 48px;
      font-family: inherit;
      color: #1a1a1a;
      background: #fff;
    }
    img, video { max-width: 100%; height: auto; }
    pre, code { white-space: pre-wrap; word-break: break-word; }
    .meta { margin-bottom: 24px; color: #646464; font-size: 14px; }
    .meta a { color: inherit; }
  </style>
</head>
<body>
  <h1>${escapeHtml(content.title)}</h1>
  <div class="meta">
    <div>作者：${escapeHtml(content.author)}</div>
    <div>来源：<a href="${escapeHtml(content.url)}">${escapeHtml(content.url)}</a></div>
    <div>保存时间：${escapeHtml(new Date().toLocaleString())}</div>
  </div>
  ${cloned.outerHTML}
</body>
</html>`;
	}
	function safeFilename(value, extension) {
		return `${value.replace(/[\\/:*?"<>|]/g, "-").replace(/\s+/g, " ").trim().slice(0, 80) || "zhihu-content"}.${extension}`;
	}
	var toastTimer;
	function showToast(message) {
		let toast = document.querySelector(".zhmt-toast");
		if (!toast) {
			toast = createElement("div", {
				className: "zhmt-toast",
				attrs: {
					id: "zh-toast",
					role: "status",
					"aria-live": "polite"
				}
			});
			document.body.appendChild(toast);
		} else if (!toast.id) toast.id = "zh-toast";
		toast.textContent = message;
		toast.classList.add("zhmt-toast--visible", "zh-toast-show");
		window.clearTimeout(toastTimer);
		toastTimer = window.setTimeout(() => {
			toast === null || toast === void 0 || toast.classList.remove("zhmt-toast--visible", "zh-toast-show");
		}, 2200);
	}
	async function exportCurrentContentAsPng() {
		const content = findCurrentReadableContent();
		if (!content) {
			showToast("未找到可导出的回答或文章");
			return;
		}
		showToast("正在生成 PNG...");
		try {
			const dataUrl = await toPng(content.element, {
				cacheBust: true,
				pixelRatio: 2,
				backgroundColor: window.getComputedStyle(document.body).backgroundColor
			});
			const blob = await (await fetch(dataUrl)).blob();
			downloadBlob(safeFilename(content.title, "png"), blob);
			showToast("PNG 已生成");
		} catch (error) {
			console.error("[zhmt] PNG export failed", error);
			showToast("PNG 生成失败，请尝试滚动到目标回答后重试");
		}
	}
	function saveCurrentContentAsHtml() {
		const content = findCurrentReadableContent();
		if (!content) {
			showToast("未找到可保存的回答或文章");
			return;
		}
		const html = buildOfflineHtml(content);
		downloadTextFile(safeFilename(content.title, "html"), html, "text/html;charset=utf-8");
		showToast("已保存 HTML");
	}
	async function copyCurrentContentAsMarkdown() {
		const content = findCurrentReadableContent();
		if (!content) {
			showToast("未找到可复制的回答或文章");
			return;
		}
		await copyText(buildMarkdown(content));
		showToast("已复制 Markdown");
	}
	async function requestText(url) {
		if (typeof GM_xmlhttpRequest === "function") return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
				method: "GET",
				url,
				onload: (response) => resolve(String(response.responseText || response.response || "")),
				onerror: () => reject(new Error(`Failed to request ${url}`)),
				ontimeout: () => reject(new Error(`Timed out requesting ${url}`))
			});
		});
		const response = await fetch(url, { credentials: "include" });
		if (!response.ok) throw new Error(`Failed to request ${url}: ${response.status}`);
		return response.text();
	}
	async function openProfileModal() {
		const existing = document.querySelector(".zhmt-modal[data-zhmt-modal=\"profile\"]");
		if (existing) existing.remove();
		const modal = createProfileShell();
		document.body.appendChild(modal.root);
		renderLucideIcons(modal.root);
		const profileUrl = findCurrentProfileUrl();
		if (!profileUrl) {
			modal.body.innerHTML = "<p>未识别到当前登录用户主页。</p><p>可以从知乎头像菜单进入个人主页后再打开此面板。</p>";
			return;
		}
		modal.body.innerHTML = "<p>正在加载个人空间...</p>";
		try {
			const html = await requestText(profileUrl);
			modal.body.innerHTML = extractProfileHtml(html, profileUrl);
		} catch (error) {
			console.error("[zhmt] profile request failed", error);
			modal.body.innerHTML = `<p>个人空间加载失败。</p><p><a href="${escapeHtml(profileUrl)}" target="_blank" rel="noreferrer">打开原主页</a></p>`;
			showToast("个人空间加载失败");
		}
	}
	function findCurrentProfileUrl(root = document) {
		for (const selector of [
			"[aria-label*=\"我的主页\"]",
			".AppHeader-profile a[href*=\"/people/\"]",
			".AppHeader-profile a[href*=\"/org/\"]",
			"a[href^=\"/people/\"]",
			"a[href^=\"/org/\"]",
			"a[href*=\"www.zhihu.com/people/\"]",
			"a[href*=\"www.zhihu.com/org/\"]"
		]) {
			const anchor = root.querySelector(selector);
			const href = anchor ? anchor.href || anchor.getAttribute("href") : void 0;
			if (href) return new URL(href, window.location.origin).href;
		}
	}
	function createProfileShell() {
		const root = createElement("section", {
			className: "zhmt-modal zh-modal-overlay",
			attrs: {
				role: "dialog",
				"aria-modal": "true",
				"aria-label": "个人空间",
				"data-zhmt-modal": "profile"
			}
		});
		const panel = createElement("div", { className: "zhmt-modal__panel zh-modal zhmt-profile-panel" });
		const header = createElement("header", { className: "zhmt-modal__header zh-modal-header" });
		const title = createElement("h2", { text: "个人空间" });
		const close = createElement("button", {
			className: "zhmt-icon-button zh-modal-close",
			html: "<i data-lucide=\"x\"></i>",
			attrs: {
				type: "button",
				"aria-label": "关闭"
			}
		});
		const body = createElement("div", { className: "zhmt-modal__body zh-modal-body" });
		header.append(title, close);
		panel.append(header, body);
		root.append(panel);
		close.addEventListener("click", () => root.remove());
		root.addEventListener("click", (event) => {
			if (event.target === root) root.remove();
		});
		return {
			root,
			body
		};
	}
	function extractProfileHtml(html, profileUrl) {
		const doc = new DOMParser().parseFromString(html, "text/html");
		removeElements(PROFILE_NOISE_SELECTORS, doc);
		const fragments = PROFILE_CONTENT_SELECTORS.flatMap((selector) => Array.from(doc.querySelectorAll(selector)));
		const uniqueFragments = Array.from(new Set(fragments)).slice(0, 8);
		if (uniqueFragments.length === 0) return `<p>未能解析个人空间内容。</p><p><a href="${escapeHtml(profileUrl)}" target="_blank" rel="noreferrer">打开原主页</a></p>`;
		uniqueFragments.forEach((fragment) => {
			removeElements(PROFILE_NOISE_SELECTORS, fragment);
			fragment.querySelectorAll("a[href]").forEach((anchor) => {
				const href = anchor.getAttribute("href");
				if (href) {
					anchor.setAttribute("href", new URL(href, profileUrl).href);
					anchor.setAttribute("target", "_blank");
					anchor.setAttribute("rel", "noreferrer");
				}
			});
		});
		return `${uniqueFragments.map((fragment) => fragment.outerHTML).join("")}<p class="zhmt-profile-link"><a href="${escapeHtml(profileUrl)}" target="_blank" rel="noreferrer">打开原主页</a></p>`;
	}
	function switchTheme() {
		const nextTheme = getCurrentTheme() === "dark" ? "light" : "dark";
		window.location.assign(buildThemeUrl(window.location.href, nextTheme));
	}
	function getCurrentTheme() {
		if (new URL(window.location.href).searchParams.get("theme") === "dark" || document.documentElement.getAttribute("data-theme") === "dark") return "dark";
		return "light";
	}
	function buildThemeUrl(inputUrl, theme) {
		const url = new URL(inputUrl);
		url.searchParams.set("theme", theme);
		return url.toString();
	}
	var toolbarIcons = {
		wiki: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4.75 3A2.75 2.75 0 0 0 2 5.75v11.5A2.75 2.75 0 0 0 4.75 20H11a2 2 0 0 1 2 2 .75.75 0 0 0 1.5 0 2 2 0 0 1 2-2h2.75A2.75 2.75 0 0 0 22 17.25V5.75A2.75 2.75 0 0 0 19.25 3H16.5A3.5 3.5 0 0 0 13 6.5V18a3.48 3.48 0 0 0-2-.63H4.75c-.69 0-1.25-.56-1.25-1.25V5.75c0-.69.56-1.25 1.25-1.25H11a2 2 0 0 1 2 2 .75.75 0 0 0 1.5 0A2 2 0 0 1 16.5 4.5h2.75c.69 0 1.25.56 1.25 1.25v11.5c0 .69-.56 1.25-1.25 1.25H16.5a3.48 3.48 0 0 0-2 .63V6.5A3.5 3.5 0 0 0 11 3H4.75z\"/></svg>",
		theme: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.21-.64-1.67-.08-.09-.13-.21-.13-.33 0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zm-4 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.5-4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm4.5 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.5 4c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z\"/></svg>",
		share: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M15.5 5.25a3.25 3.25 0 1 1 .92 2.26l-7.24 4.14a3.36 3.36 0 0 1 0 .7l7.24 4.14a3.25 3.25 0 1 1-.75 1.3l-7.24-4.14a3.25 3.25 0 1 1 0-3.3l7.24-4.14a3.24 3.24 0 0 1-.17-.96z\"/></svg>",
		save: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M5 4.75C5 3.78 5.78 3 6.75 3h10.5C18.22 3 19 3.78 19 4.75v15.38c0 .64-.73 1-1.24.62L12 16.45l-5.76 4.3A.75.75 0 0 1 5 20.13V4.75zm3 3.5A.75.75 0 0 0 8.75 9h6.5a.75.75 0 0 0 0-1.5h-6.5A.75.75 0 0 0 8 8.25zm0 3A.75.75 0 0 0 8.75 12h4.5a.75.75 0 0 0 0-1.5h-4.5A.75.75 0 0 0 8 11.25z\"/></svg>",
		filter: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 5.25A1.25 1.25 0 0 1 5.25 4h13.5a1.25 1.25 0 0 1 .96 2.05L14 12.9v4.85c0 .42-.21.8-.56 1.03l-2 1.33A1.25 1.25 0 0 1 9.5 19.08V12.9L3.54 6.05A1.25 1.25 0 0 1 4 5.25zm1.8.25 5.02 5.78c.12.14.18.31.18.49v5.98l1.5-1v-4.98c0-.18.06-.35.18-.49L17.7 5.5H5.8z\"/></svg>",
		settings: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z\"/></svg>",
		copy: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"9\" y=\"9\" width=\"13\" height=\"13\" rx=\"2\"/><path d=\"M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\"/></svg>",
		chevron: "<svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M7 10l5 5 5-5z\"/></svg>"
	};
	function initToolbar() {
		var _document$querySelect2;
		const existingToolbar = document.querySelector("#zh-tools-panel");
		const existingMarkdownControl = document.querySelector(".zh-copy-md-container");
		if ((existingToolbar === null || existingToolbar === void 0 ? void 0 : existingToolbar.classList.contains("zhmt-toolbar")) && existingMarkdownControl) return;
		if (!(existingToolbar === null || existingToolbar === void 0 ? void 0 : existingToolbar.classList.contains("zhmt-toolbar"))) existingToolbar === null || existingToolbar === void 0 || existingToolbar.remove();
		if (!existingMarkdownControl) {
			var _document$querySelect;
			(_document$querySelect = document.querySelector(".zhmt-markdown-control")) === null || _document$querySelect === void 0 || _document$querySelect.remove();
		}
		(_document$querySelect2 = document.querySelector("#immersive-exit-btn")) === null || _document$querySelect2 === void 0 || _document$querySelect2.remove();
		if (!existingMarkdownControl) initMarkdownControl();
		if (!(existingToolbar === null || existingToolbar === void 0 ? void 0 : existingToolbar.classList.contains("zhmt-toolbar"))) initActionToolbar();
	}
	function initActionToolbar() {
		const toolbar = createElement("div", {
			className: "zhmt-toolbar",
			attrs: {
				role: "toolbar",
				"aria-label": "知乎本地阅读工具"
			}
		});
		toolbar.id = "zh-tools-panel";
		[
			{
				label: "个人空间",
				iconHtml: toolbarIcons.wiki,
				onClick: openProfileModal
			},
			{
				label: "分享 PNG",
				iconHtml: toolbarIcons.share,
				onClick: exportCurrentContentAsPng
			},
			{
				label: "保存 HTML",
				iconHtml: toolbarIcons.save,
				onClick: saveCurrentContentAsHtml
			},
			{
				label: "关键词屏蔽",
				iconHtml: toolbarIcons.filter,
				onClick: openBlocklistPanel
			},
			{
				label: "白天/夜间",
				iconHtml: toolbarIcons.theme,
				onClick: switchTheme
			}
		].forEach((action, index) => {
			const button = createElement("button", {
				className: "zhmt-toolbar__button zh-square-btn",
				html: action.iconHtml,
				attrs: {
					type: "button",
					"aria-label": action.label
				}
			});
			button.appendChild(createElement("span", {
				className: "zhmt-toolbar__tooltip",
				text: action.label,
				attrs: { "aria-hidden": "true" }
			}));
			button.addEventListener("click", () => {
				action.onClick();
			});
			button.style.animationDelay = `${index * 50}ms`;
			toolbar.appendChild(button);
		});
		document.body.appendChild(toolbar);
		renderLucideIcons(toolbar);
	}
	function initMarkdownControl() {
		const control = createElement("div", {
			className: "zhmt-markdown-control zh-copy-md-container",
			attrs: { "aria-label": "Markdown 操作" }
		});
		const mainButton = createElement("button", {
			className: "zhmt-markdown-control__main zh-copy-md-btn",
			html: `${toolbarIcons.copy}<span>复制 MD</span>`,
			attrs: {
				type: "button",
				"aria-label": "复制 Markdown",
				title: "复制 Markdown"
			}
		});
		const menuButton = createElement("button", {
			className: "zhmt-markdown-control__toggle zh-copy-md-drop",
			html: toolbarIcons.chevron,
			attrs: {
				type: "button",
				"aria-label": "展开 Markdown 操作",
				title: "展开 Markdown 操作",
				"aria-haspopup": "menu",
				"aria-expanded": "false"
			}
		});
		const menu = createElement("div", {
			className: "zhmt-markdown-control__menu zh-copy-md-menu",
			attrs: { role: "menu" }
		});
		const menuItem = createElement("button", {
			className: "zhmt-markdown-control__menu-item zh-copy-md-option",
			text: "复制 Markdown",
			attrs: {
				type: "button",
				role: "menuitem"
			}
		});
		const copyMarkdown = () => {
			closeMenu();
			copyCurrentContentAsMarkdown();
		};
		const openMenu = () => {
			control.classList.add("zhmt-markdown-control--open");
			menu.classList.add("zh-copy-md-menu-show");
			menuButton.setAttribute("aria-expanded", "true");
		};
		const closeMenu = () => {
			control.classList.remove("zhmt-markdown-control--open");
			menu.classList.remove("zh-copy-md-menu-show");
			menuButton.setAttribute("aria-expanded", "false");
		};
		const toggleMenu = () => {
			if (control.classList.contains("zhmt-markdown-control--open")) {
				closeMenu();
				return;
			}
			openMenu();
		};
		mainButton.addEventListener("click", copyMarkdown);
		menuItem.addEventListener("click", copyMarkdown);
		menuButton.addEventListener("click", (event) => {
			event.stopPropagation();
			toggleMenu();
		});
		document.addEventListener("click", (event) => {
			if (!control.contains(event.target)) closeMenu();
		});
		document.addEventListener("keydown", (event) => {
			if (event.key === "Escape") closeMenu();
		});
		menu.appendChild(menuItem);
		control.append(mainButton, menuButton, menu);
		document.body.appendChild(control);
		renderLucideIcons(control);
	}
	var ZHMT_BOOTSTRAPPED = "__zhmtBootstrapped";
	var VERSION = "0.0.5";
	onDomReady(() => {
		if (window[ZHMT_BOOTSTRAPPED]) return;
		window[ZHMT_BOOTSTRAPPED] = true;
		document.documentElement.classList.add("zhmt-booting");
		console.info(`[zhmt] boot ${VERSION}`);
		try {
			syncNativeTokens();
			injectStyle(toolkit_default);
			applyPageCleanup();
			initToolbar();
			initBlocklist().catch((error) => {
				console.error("[zhmt] blocklist init failed", error);
			});
			const refreshPage = debounce(() => {
				syncNativeTokens();
				applyPageCleanup();
				initToolbar();
				debouncedApplyBlocklist();
			}, 500);
			[
				200,
				800,
				1800,
				3600
			].forEach((delay) => {
				window.setTimeout(refreshPage, delay);
			});
			new MutationObserver((mutations) => {
				if (mutations.some((mutation) => Array.from(mutation.addedNodes).some(isPageContentMutation))) refreshPage();
			}).observe(document.body, {
				childList: true,
				subtree: true
			});
			window.addEventListener("load", refreshPage);
			window.addEventListener("resize", refreshPage, { passive: true });
			console.info("[zhmt] ready");
		} catch (error) {
			console.error("[zhmt] init failed", error);
		}
	});
	function isPageContentMutation(node) {
		if (node.nodeType !== Node.ELEMENT_NODE) return false;
		if (node.closest("#zh-tools-panel, .zh-copy-md-container, .zhmt-modal, .zhmt-toast, #zh-toast")) return false;
		return true;
	}
})();
