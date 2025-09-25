# Upcycle Web App

The Upcycle App is a tool for planning quality upcycle builds in Factorio.
It works by finding the "best" way of producing something.
More specifically, it uses a *linear solver* to find the combination of recipes with the *minimized cost function* that produces some output.

Of course there is no single best way to handle upcycling in general, with some trade-offs having subjective elements such as build complexity.
Nonetheless a linear solver can still be a very powerful tool, with some use cases listed below:
- Insight into which high-level strategies or planets are best for upcycling certain items
- How best to make something on a specific planet
- Optimal quality-to-productivity module ratios for each recipe at each stage of quality
- Whether to use speed beacons on lower quality steps, and if so, how much
- Whitelisting or blacklisting certain recipes, usually to help simplify an upcycling strategy
- Exact building ratios for a specific upcycling strategy

The live web app can be found here: https://scottmsul.github.io/upcycle/

The discord group can be found here: https://discord.gg/pejMjkjBK4

# Usage

First specify the high quality items you want to create in the **Output Items** area at the top.
Next make any desired changes to the various **Solver Setup** fields and cost functions. Some example cost functions include:
- For fewest buildings, set all **Crafting Machines** costs to 1 and all other costs to 0.
- For fewest modules, set **Productivity Module** and **Quality Module** costs to 1 and all other costs to 0.
- For fewest resources, set all **Resources** costs to 1 (or just the non-renewable ones) and all other costs to 0.
- For fewest inputs in an Inputs->Outputs setup, such as by whitelisting recipes and specifying exact Inputs, set all **Inputs** costs to 1 and all other costs to 0.
- Of course you can also make your own customized cost function by setting these to whatever you want. In many cases it may be desirable to try balancing these various trade-offs.

Some notes about specific fields are given below.

**Preferences**

`Max Quality Unlocked` is Legendary by default.
Note that changing this will cap all quality selectors to the new max quality.

`Allow Byproducts` is true by default.
If `Allow Byproducts` is not checked, the solver will be forced to void any byproducts, with added cost for any additional recyclers.

**Crafting Machines**

Crafting machines can be excluded by unchecking them, such as those that aren't researched yet.
The Quality and Cost can also be set for individually for each crafting machine.

When multiple crafting machines can be used for a specific recipe, the solver always defaults to the one with the highest base common speed.
This strategy always results in the most "advanced" building, such as Foundries and EM plants over Assembly Machine 3s, Cryogenic Plants over Chemical Plants, and so on.

**Modules**

By default these are set to max tier and quality.

**Speed Beacons**

This can be a pretty confusing topic for people new to quality.
It's true that speed always lowers the quality % of a recipe, and if optimizing for inputs-per-output then the optimal number of speed beacons is always zero.
However, a *little* bit of speed beacon can go a *long way* in terms of reducing the number of buildings/modules, or equivalently increasing throughput for the same number of buildings/modules, at the expense of some amount of inputs-per-output.

For instance when starting quality upcycling for the first time, the higher-quality modules are very precious and should be used as efficiently as possible.
It may very well be worth it to sacrfice a few inputs if it means churning out way more upscaled items given a limited number of modules.

If `Check Speed Beacons` is set, the solver checks every possible number of speed modules between 0 and `Max Speed Modules` for each recipe, where the number of beacons is equal to the number of speed modules divided by 2 rounded up.
By default, the `Speed Module Quality` and `Beacon Quality` are set to Legendary and the `Speed Module Tier` is set to 3.

In practice it's likely that lower speed tiers and lower quality beacons might be more optimal due to the higher granularity of speed modifiers that can be checked, though I'm not sure the best way to make the solver to check all these possibilities due to the combinatorial blow-up.
Also using more than the minimum necessary number of beacons could be a way to add even more granularity or check even smaller speed modifiers.

**Productivity Research**

Note this should be the *Percent Bonus* between 0-300 and **not** the *Research Level* between 0-30.

**Planets**

Checking a planet/surface will include both its recipes and its resources, and unchecking it will exclude its recipes and resources.

**Resources**

Ideally this would calculate how many *machines* you would need for each resource (i.e. number of pumpjacks, mining drills, etc).
However, this feature isn't developed yet, so the solver currently treats each resource as if it were an input item, and computes the required input amount/sec without translating to machines.
Note that checking and unchecking any planet will automatically display or hide any of its resources.

**Input Items**

Use this section to provide the solver calculations with direct inputs.
This can be useful if you're already producing certain items somewhere else and feeding them into a separate upcycling setup.
For instance, one strategy might be to produce legendary iron and copper in an isolated build such as with asteroid upcycling, then run the solver with legendary iron and copper as inputs in order to upcycle planet-specific resources such as tungsten or holmium.

**Recipes**

This section allows more control over which recipes go into the solver.
By default, this is set to an empty BlackList which includes all recipes in the game.
To exclude certain recipes, add them to a BlackList.
To only run with a subset of recipes, use a WhiteList.
Tinkering with recipe whitelists and blacklists is a great way to try to simplify upcycling builds.

**Run Solver**

Click the `Run Solver` button to run the solver.
The status will display `not run yet`, `currently running...`, or `solve complete!`.
Note that changing any settings after a solve will reset the status to `not run yet`.
If no solution is possible it will display `no solution found`.

# How To Run Locally
```
$ npm install
$ npx http-server -c0
```
