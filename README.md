![my image](./img/mm4i.png)


# Mindmaps 4 Internet

> MM4I (Mindmaps 4 Internet) is a mindmapping tool accessible
directly through your web browser, designed to work
both on mobile phones and on desktop computers.
You can create and edit mindmaps without needing to install
any software, and your work is stored locally for offline use.
Key features include:
 a **visual undo/redo history**,
 add **notes** to nodes,
 **search** nodes and notes,
 **visually enhance nodes**,
 **dynamically link nodes** (through the search function),
 create **paths** between nodes (called "stairs"),
 and **create mindmaps with AI**.


You can start MM4I here:

<a href="https://mm4i.vercel.app/mm4i.html">
    <!-- https://lborgman.github.io/mm4i/mm4i.html" -->
    <figure>
    <img src="./img/mm4i.svg" width="40px" title="Start Mindmaps 4 Internet">
    </figure>
</a>


There is not much to learn—just try it. If you think something needs to be explained, please [tell me](https://github.com/lborgman/mm4i/issues).
(Hm. But take a look at the table of contents below.)


> **Table of contents**
[Node notes and search links](#node-notes-and-search-links)
[Undo/Redo (edit history)](#undoredo-edit-history)
[Let AI summarize a link](#let-ai-summarize-a-link)
[Sync and Backup](#sync-and-backup)
[Background](#background)



### Node notes and search links
Each node in a mindmap can have a note that you create.  You can search the mindmap for text in node notes (and node topics).  And you can create "search links" in your node note that start such a search when clicked.

(To create a "search link" just click the orange search icon in the toolbar when you are editing a node note.)


### Undo/Redo (edit history)
There is undo/redo for the mindmap you are editing.
However it is visual. It is not bound to the keyboard shortcut Ctrl-Z as you may be used to.
Click on the clock symbol in the lower left corner to see the edit history panel.

##### Linear/tree style for edit history
* **Linear:** This is what you find in most apps.
* **Tree:** If you use this style you can create and investigate branches.

##### Bookmarks for edit history
The edit history panel lets you quickly move between different views of you mindmap subject.

If you find some views more useful you can bookmark them.  If you name the bookmarks, they will be there the next time you start editing the mindmap.


### Let AI summarize a link
You can use some of the major AIs to get a mindmap from a link. It works like asking the AI for a summary of a link, but the summary is presented in the form of a mindmap.

If you install this app it will show up as a share target. Use this to quickly get a summary mindmap.

#### Which AI can you use?
You can try to use the AI prompt that MM4I makes in any AI you have access to.
However it is a rather cumbersome manual process.
It is much easier to use one of the AI that has automation support builtin to MM4I.

There is currently one AI (Groq) that you can use for free.
Groq is often very fast.
However MM4I uses the free tier and Groq may answer that it has reach a free tier limit.

This is a bit inconvenient of course. 
And maybe the output from Groq could be better if we paid for it.
I do not want to pay for this myself.
So I am trying to figure out some other way to pay for the tokens that Groq AI used.


### Sync and Backup
There is currently no built in backup. And the mindmaps are only stored on your device (in your web browser, actually).

So if you lose your device, your mindmaps may also be lost.

But there is one possible remedy: You can sync your mindmaps to other devices.  (This must be done manually, but I believe it is quite simple.)



## Background
Ever since I first saw mindmaps in practical use, I have wanted to use it myself.  But. It looked like you needed a big paper.  Or rather several to redraw the mindmap. 

Putting the mindmap in a computer seemed like a good idea.  And then, preferably the computer I always bring with me, my mobile.

Yes, I know, there are some apps for Android that can do this. But I never install apps from unknown developers because of potential security problems.

A web page has fewer security risks than a native app. And you can actually run a web page like this offline. (You have to *"install"* it, but for a web app like MM4I the *"install"* just means that the sources for the web page is cached locally on you device.)


## Acknowledgement

First of all I would not have written **MM4I** (Mindmaps for Internet) if [Zhigang Zhang](https://github.com/hizzgdev) had not written **jsmind**. 

I was looking for mindmap software that ran in the web browser.  The only mindmap software I found was jsmind.  It ran quite nicely in a web browser on a desktop PC using a mouse.  However it did not work in my mobile (Android, of course).

So I thought I should just fix that... 

It was far more work than I expected.  But also difficult sometimes, which made it more fun.

I strived a bit to make it easy to move nodes in a mindmap.  Zhigang (the author of jsmind) came up with a nice idea which I decided to use.

Using a touch screen on a mobile phone instead of a mouse on a desktop can be a challenge for complex interactions.  **jssm** helped a lot when I struggled to implement that.

I did add some things to try to give MM4I the "feel" of a mindmap.  Colors, shapes, and notes.  And notes for nodes - which I think is a natural addition for a computer based mindmap. (Hm. This gave me a nice lesson on the interaction between JavaScript and the web browser screen renderer. Sometimes you need to fail before you can learn.)

*Software included in MM4I:*
* [Google Material Design, ver 2](https://m2.material.io/)
* [Google Workbox (for PWA)](https://developer.chrome.com/docs/workbox)
* [jsmind](https://www.npmjs.com/package/jsmind)
* [jssm](https://www.npmjs.com/package/jssm)
    * [jssm-viz](https://www.npmjs.com/package/jssm-viz)
    * [viz-js](https://www.npmjs.com/package/@viz-js/viz)
* [PeerJs](https://peerjs.com)
* [TOAST UI Editor](https://github.com/nhn/tui.editor/blob/master/README.md)

*Software I used when developing MM4I:*
* [GitHub](https://github.com/)
* [Google Chrome](https://en.wikipedia.org/wiki/Google_Chrome)
* [Visual Studio Code](https://code.visualstudio.com/)

##### My developer notes
Just some links to bugs etc.
* [mobile display bug example](https://lborgman.github.io/mm4i/mobile-disp-bug.html)
* [mobile display bug issue](https://issues.chromium.org/issues/381679574)
* [mobile display bug workaround](https://lborgman.github.io/mm4i/mobile-disp-bug-workaround.html)
