#Lightweight Box2DJS
**A lightweight and library free version of the Physics engine for javascript.**
***

This is an attempt to make the Box2DJS Physics engine for javascript [Found here](http://box2d-js.sourceforge.net/) lightweight and 'livrary free' as the original version relies on [Prototype](http://prototypejs.org/) for some Objects prototype manipulation.

Once cleaned up the library was minified with [jscompress](http://jscompress.com/) and further compressed (packed) with Dean Edwards 'packer' [http://dean.edwards.name/packer/](http://dean.edwards.name/packer/). The final result is a file weight reduction from 508kb (382kb Box 2DJS classes + 126 prototypeJS) to 73kb plus the advantage of not depending on any external libraries.

The example provided is also the original shown in [sourceforge project's page](http://box2d-js.sourceforge.net/).

The idea is to release this in case someone else might need it in the future. _This is an altered version of Erin Catto's Box2DJS, I make no claim of property. All credits for the original author._

**Original copyright follows:**

Copyright (c) 2006-2007 Erin Catto http:
This software is provided 'as-is', without any express or implied warranty.  In no event will the authors be held liable for any damages arising from the use of this software. 
Permission is granted to anyone to use this software for any purpose, including commercial applications, and to alter it and redistribute it freely, subject to the following restrictions:
1. The origin of this software must not be misrepresented; you must not claim that you wrote the original software. If you use this software in a product, an acknowledgment in the product documentation would be appreciated but is not required.
2. Altered source versions must be plainly marked, and must not be misrepresented the original software.
3. This notice may not be removed or altered from any source distribution.