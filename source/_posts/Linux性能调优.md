---
title: Linux性能调优
date: 2021-04-02 16:20:57
tags: Linux
---

# 一、前提

我们可以在文章的开始就列出一个列表，列出可能影响Linux操作系统性能的一些调优参数，但这样做其实并没有什么价值。因为性能调优是一个非常困难的任务，它要求对硬件、操作系统、和应用都有着相当深入的了解。如果性能调优非常简单的话，那些我们要列出的调优参数早就写入硬件的微码或者操作系统中了，我们就没有必要再继续读这篇文章了。正如下图所示，服务器的性能受到很多因素的影响。



![图片](https://mmbiz.qpic.cn/mmbiz_png/SeWfibBcBT0EuxfhHv3gxaMWjfngI7kMAkYRPibWD4k8q7EXhnHAOEhiczcjBMTXA7Zx1cTWib36WdTic82l4ZRqQiaw/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

当面对一个使用单独IDE硬盘的，有20000用户的数据库服务器时，即使我们使用数周时间去调整I/O子系统也是徒劳无功的，通常一个新的驱动或者应用程序的一个更新（如SQL优化）却可以使这个服务器的性能得到明显的提升。正如我们前面提到的，不要忘记系统的性能是受多方面因素影响的。理解操作系统管理系统资源的方法将帮助我们在面对问题时更好的判断应该对哪个子系统进行调整。





# **二、Linux的CPU调度**



任何计算机的基本功能都十分简单，那就是计算。为了实现计算的功能就必须有一个方法去管理计算资源、处理器和计算任务（也被叫做线程或者进程）。非常感谢Ingo Molnar，他为Linux内核带来了O（1）CPU调度器，区别于旧有的O（n）调度器，新的调度器是动态的，可以支持负载均衡，并以恒定的速度进行操作。



新调度器的可扩展性非常好，无论进程数量或者处理器数量，并且调度器本身的系统开销更少。新调取器的算法使用两个优先级队列。



・活动运行队列

・过期运行队列

调度器的一个重要目标是根据优先级权限有效地为进程分配CPU 时间片，当分配完成后它被列在CPU的运行队列中，除了 CPU 的运行队列之外，还有一个过期运行队列。当活动运行队列中的一个任务用光自己的时间片之后，它就被移动到过期运行队列中。在移动过程中，会对其时间片重新进行计算。如果活动运行队列中已经没有某个给定优先级的任务了，那么指向活动运行[队列和](http://mp.weixin.qq.com/s?__biz=MzU5NTAzNjM0Mw==&mid=2247484705&idx=3&sn=a92401c2e99375866fc5a18dfa8f62b1&chksm=fe7954f9c90eddef5e6a0f011378fb890fca9f008e87e22d612d1db192881ba4a7463f314830&scene=21#wechat_redirect)过期运行队列的指针就会交换，这样就可以让过期优先级列表变成活动优先级的列表。通常交互式进程（相对与实时进程而言）都有一个较高的优先级，它占有更长的时间片，比低优先级的进程获得更多的计算时间，但通过调度器自身的调整并不会使低优先级的进程完全被饿死。新调度器的优势是显著的改变Linux内核的可扩展性，使新内核可以更好的处理一些有大量进程、大量处理器组成的企业级应用。新的O(1)调度器包含仔2.6内核中，但是也向下兼容2.4内核。

![图片](https://mmbiz.qpic.cn/mmbiz_png/SeWfibBcBT0EuxfhHv3gxaMWjfngI7kMAnCGGL0pek76VfvZFDPjdPKPmH1cLWY5RRgNj4Zs8vwm2MqIDaDyGbQ/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)





调度器另外一个重要的优势是体现在对NUMA(non-uniform memory architecture)和SMP（symmetric multithreading processors）的支持上，例如INTEL@的超线程技术



改进的NUMA支持保证了负载均衡不会发生在CECs或者NUMA节点之间，除非发生一个节点的超出负载限度





# **三、Linux的内存架构**



今天我们面对选择32位操作[系统还](http://mp.weixin.qq.com/s?__biz=MzU5NTAzNjM0Mw==&mid=2247486076&idx=1&sn=42cff3e231ef83824fdb34829de14e7f&chksm=fe795ba4c90ed2b245255ea7cb5cea6ce8804b64ab6306946dea9dcbfd526e68938bf646c346&scene=21#wechat_redirect)是64位操作系统的情况。对企业级用户它们之间最大的区别是64位操作系统可以支持大于4GB的内存寻址。从性能角度来讲，我们需要了解32位和64位操作系统都是如何进行物理内存和虚拟内存的映射的。



![图片](https://mmbiz.qpic.cn/mmbiz_png/SeWfibBcBT0EuxfhHv3gxaMWjfngI7kMAyM0gQ5Y99vQBeAibc4EbH1AhdnU1GFRvZ9505CrGYjTIohzib5Ffias4w/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)





在上面图示中我们可以看到64位和32位Linux内核在寻址上有着显著的不同。



在32位架构中，比如IA-32，Linux内核可以直接寻址的范围只有物理内存的第一个GB（如果去掉保留部分还剩下896MB），访问内存必须被映射到这小于1GB的所谓ZONE_NORMAL空间中，这个操作是由应用程序完成的。但是分配在ZONE_HIGHMEM中的内存页将导致性能的降低。



在另一方面，64位架构比如x86-64（也称作EM64T或者AMD64）。ZONE_NORMAL空间将扩展到64GB或者128GB（实际上可以更多，但是这个数值受到操作系统本身支持内存容量的限制）。正如我们看到的，使用64位操作系统我们排除了因ZONE_HIGHMEM部分内存对性能的影响的情况。



实际中，在32位架构下，由于上面所描述的内存寻址问题，对于大内存，高负载应用，会导致死机或严重缓慢等问题。虽然使用hugemen核心可缓解，但采取x86_64架构是最佳的解决办法。







# **四、虚拟内存管理**



因为操作系统将内存都映射为虚拟内存，所以操作系统的物理内存结构对用户和应用来说通常都是不可见的。如果想要理解Linux系统内存的调优，我们必须了解Linux的虚拟[内存机制](http://mp.weixin.qq.com/s?__biz=MzU5NTAzNjM0Mw==&mid=2247485874&idx=2&sn=6533223eb96122e2c21f8a833b626c02&chksm=fe79586ac90ed17cb4896e94343f9b34a674e9540a6144954fa2e74f3fbe4191cc1e9bd8f34c&scene=21#wechat_redirect)。应用程序并不分配物理内存，而是向Linux内核请求一部分映射为虚拟内存的内存空间。如下图所示虚拟内存并不一定是映射物理内存中的空间，如果应用程序有一个大容量的请求，也可能会被映射到在磁盘子系统中的swap空间中。

![图片](https://mmbiz.qpic.cn/mmbiz_png/SeWfibBcBT0EuxfhHv3gxaMWjfngI7kMAaEHnkqeBU82ZG834ZgkWiaFh2KzmiawMxfobfuPzvWLppa3hF7oLMU3A/640?wx_fmt=gif&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

另外要提到的是，通常应用程序不直接将数据写到磁盘子系统中，而是写入缓存和缓冲区中。Bdflush守护进程将定时将缓存或者缓冲区中的数据写到硬盘上。

Linux内核处理数据写入磁盘子系统和管理磁盘缓存是紧密联系在一起的。相对于其他的操作系统都是在内存中分配指定的一部分作为磁盘缓存，Linux处理内存更加有效，默认情况下虚拟内存管理器分配所有可用内存空间作为磁盘缓存，这就是为什么有时我们观察一个配置有数G内存的Linux系统可用内存只有20MB的原因。

同时Linux使用swap空间的机制也是相当高效率的，如上图所示虚拟内存空间是由物理内存和磁盘子系统中的swap空间共同组成的。如果虚拟内存管理器发现一个已经分配完成的内存分页已经长时间没有被调用，它将把这部分内存分页移到swap空间中。经常我们会发现一些守护进程，比如getty，会随系统启动但是却很少会被应用到。这时为了释放昂贵的主内存资源，系统会将这部分内存分页移动到swap空间中。上述就是Linux使用swap空间的机制，当swap分区使用超过50％时，并不意味着物理内存的使用已经达到瓶颈了，swap空间只是Linux内核更好的使用系统资源的一种方法。

简单理解：Swap usage只表示了Linux管理内存的有效性。对识别内存瓶颈来说，Swap In/Out才是一个比较又意义的依据，如果Swap In/Out的值长期保持在每秒200到300个页面通常就表示系统可能存在内存的瓶颈。下面的事例是好的状态：

![图片](https://mmbiz.qpic.cn/mmbiz_png/SeWfibBcBT0EuxfhHv3gxaMWjfngI7kMAnDBWAyys2w9VZTv3N7L3TIMu9OpgibjzRwtJtJzoicgM7iaicBibqlYUNvw/640?wx_fmt=png&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)





# **五、模块化的I/O调度器**

就象我们知道的Linux2.6内核为我们带来了很多新的特性，这其中就包括了新的I/O调度机制。旧的2.4内核使用一个单一的I/O调度器，2.6 内核为我们提供了四个可选择的I/O调度器。因为Linux系统应用在很广阔的范围里，不同的应用对I/O设备和负载的要求都不相同，例如一个笔记本电脑和一个10000用户的数据库服务器对I/O的要求肯定有着很大的区别。

（1）Anticipatory

anticipatory I/O调度器创建假设一个块设备只有一个物理的查找磁头（例如一个单独的SATA硬盘），正如anticipatory调度器名字一样，anticipatory调度器使用“anticipatory”的算法写入硬盘一个比较大的数据流代替写入多个随机的小的数据流，这样有可能导致写 I/O操作的一些延时。这个调度器适用于通常的一些应用，比如大部分的个人电脑。

（2）Complete Fair Queuing (CFQ)

Complete Fair Queuing（CFQ）调度器是Red Flag DC Server 5使用的标准算法。CFQ调度器使用QoS策略为系统内的所有任务分配相同的带宽。CFQ调度器适用于有大量计算进程的多用户系统。它试图避免进程被饿死和实现了比较低的延迟。

（3）Deadline

deadline调度器是使用deadline算法的轮询的调度器，提供对I/O子系统接近实时的操作，deadline调度器提供了很小的延迟和维持一个很好的磁盘吞吐量。如果使用deadline算法请确保进程资源分配不会出现问题。

（4）NOOP

NOOP调度器是一个简化的调度程序它只作最基本的合并与排序。与桌面系统的关系不是很大，主要用在一些特殊的软件与硬件环境下，这些软件与硬件一般都拥有自己的调度机制对内核支持的要求很小，这很适合一些嵌入式系统环境。作为桌面用户我们一般不会选择它。





# **六、网络子系统**

新的网络中断缓和（NAPI）对网络子系统带来了改变，提高了大流量网络的性能。Linux内核在处理网络堆栈时，相比降低系统占用率和高吞吐量更关注可靠性和低延迟。所以在某些情况下，Linux建立一个防火墙或者文件、打印、数据库等企业级应用的性能可能会低于相同配置的Windows服务器。

在传统的处理网络封包的方式中，如下图蓝色箭头所描述的，一个以太网封包到达网卡接口后，如果MAC地址相符合会被送到网卡的缓冲区中。网卡然后将封包移到操作系统内核的网络缓冲区中并且对CPU发出一个硬中断，CPU会处理这个封包到相应的网络堆栈中，可能是一个TCP端口或者Apache应用中。

![图片](https://mmbiz.qpic.cn/mmbiz_jpg/SeWfibBcBT0EuxfhHv3gxaMWjfngI7kMA4LoUKc66wnIUCFdQe1RS1DJibpvj47COXO72FrHl2IMMCczHex2socA/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1&wx_co=1)

这是一个处理网络封包的简单的流程，但从中我们可以看到这个处理方式的缺点。正如我们看到的，每次适合网络封包到达网络接口都将对CPU发出一个硬中断信号，中断CPU正在处理的其他任务，导致切换动作和对CPU缓存的操作。你可能认为当只有少量的网络封包到达网卡的情况下这并不是个问题，但是千兆网络和现代的应用将带来每秒钟成千上万的网络数据，这就有可能对性能造成不良的影响。

正是因为这个情况，NAPI在处理网络通讯的时候引入了计数机制。对第一个封包，NAPI以传统的方式进行处理，但是对后面的封包，网卡引入了POLL 的轮询机制：如果一个封包在网卡DMA环的缓存中，就不再为这个封包申请新的中断，直到最后一个封包被处理或者缓冲区被耗尽。这样就有效的减少了因为过多的中断CPU对系统性能的影响。同时，NAPI通过创建可以被多处理器执行的软中断改善了系统的可扩展性。NAPI将为大量的企业级多处理器平台带来帮助，它要求一个启用NAPI的驱动程序。在今天很多驱动程序默认没有启用NAPI，这就为我们调优网络子系统的性能提供了更广阔的空间。





# **七、理解Linux调优参数**

因为Linux是一个开源操作系统，所以又大量可用的性能监测工具。对这些工具的选择取决于你的个人喜好和对数据细节的要求。所有的性能监测工具都是按照同样的规则来工作的，所以无论你使用哪种监测工具都需要理解这些参数。下面列出了一些重要的参数，有效的理解它们是很有用处的。

（1）处理器参数

・CPU utilization

这是一个很简单的参数，它直观的描述了每个CPU的利用率。在xSeries架构中，如果CPU的利用率长时间的超过80％，就可能是出现了处理器的瓶颈。

・Runable processes

这个值描述了正在准备被执行的进程，在一个持续时间里这个值不应该超过物理CPU数量的10倍，否则CPU方面就可能存在瓶颈。

・Blocked

描述了那些因为等待I/O操作结束而不能被执行的进程，Blocked可能指出你正面临I/O瓶颈。

・User time

描述了处理用户进程的百分比，包括nice time。如果User time的值很高，说明系统性能用在处理实际的工作。

・System time

描述了CPU花费在处理内核操作包括IRQ和软件中断上面的百分比。如果system time很高说明系统可能存在网络或者驱动堆栈方面的瓶颈。一个系统通常只花费很少的时间去处理内核的操作。

・Idle time

描述了CPU空闲的百分比。

・Nice time

描述了CPU花费在处理re-nicing进程的百分比。

・Context switch

系统中线程之间进行交换的数量。

・Waiting

CPU花费在等待I/O操作上的总时间，与blocked相似，一个系统不应该花费太多的时间在等待I/O操作上，否则你应该进一步检测I/O子系统是否存在瓶颈。

・Interrupts

Interrupts 值包括硬Interrupts和软Interrupts，硬Interrupts会对系统性能带来更多的不利影响。高的Interrupts值指出系统可能存在一个软件的瓶颈，可能是内核或者驱动程序。注意Interrupts值中包括CPU时钟导致的中断（现代的xServer系统每秒1000个 Interrupts值）。

（2）内存参数

・Free memory

相比其他操作系统，Linux空闲内存的值不应该做为一个性能参考的重要指标，因为就像我们之前提到过的，Linux内核会分配大量没有被使用的内存作为文件系统的缓存，所以这个值通常都比较小。

・Swap usage

这 个值描述了已经被使用的swap空间。Swap usage只表示了Linux管理内存的有效性。对识别内存瓶颈来说，Swap In/Out才是一个比较又意义的依据，如果Swap In/Out的值长期保持在每秒200到300个页面通常就表示系统可能存在内存的瓶颈。

・Buffer and cache

这个值描述了为文件系统和块设备分配的缓存。在Red Flag DC Server 5版本中,你可以通过修改/proc/sys/vm中的page_cache_tuning来调整空闲内存中作为缓存的数量。

・Slabs

描述了内核使用的内存空间，注意内核的页面是不能被交换到磁盘上的。

・Active versus inactive memory

提供了关于系统内存的active[内存](http://mp.weixin.qq.com/s?__biz=MzU5NTAzNjM0Mw==&mid=2247485329&idx=4&sn=d52185809985d7012a15cfc50119f072&chksm=fe795649c90edf5fa823e702435ee31767598ba753ac2c4be5d95df358265cee977a270f0fbd&scene=21#wechat_redirect)信息，Inactive内存是被kswapd守护进程交换到磁盘上的空间。

（3）网络参数

・Packets received and sent

这个参数表示了一个指定网卡接收和发送的数据包的数量。

・Bytes received and sent

这个参数表示了一个指定网卡接收和发送的数据包的字节数。

・Collisions per second

这个值提供了发生在指定网卡上的网络冲突的数量。持续的出现这个值代表在网络架构上出现了瓶颈，而不是在服务器端出现的问题。在正常配置的网络中冲突是非常少见的，除非用户的网络环境都是由hub组成。

・Packets dropped

这个值表示了被内核丢掉的数据包数量，可能是因为防火墙或者是网络缓存的缺乏。

・Overruns

Overruns表达了超出网络接口缓存的次数，这个参数应该和packets dropped值联系到一起来判断是否存在在网络缓存或者网络队列过长方面的瓶颈。

・Errors 这个值记录了标志为失败的帧的数量。这个可能由错误的网络配置或者部分网线损坏导致，在铜口千兆以太网环境中部分网线的损害是影响性能的一个重要因素。

（4）块设备参数

・Iowait

CPU等待I/O操作所花费的时间。这个值持续很高通常可能是I/O瓶颈所导致的。

・Average queue length

I/O请求的数量，通常一个磁盘队列值为2到3为最佳情况，更高的值说明系统可能存在I/O瓶颈。

・Average wait

响应一个I/O操作的平均时间。Average wait包括实际I/O操作的时间和在I/O队列里等待的时间。

・Transfers per second

描述每秒执行多少次I/O操作（包括读和写）。Transfers per second的值与kBytes per second结合起来可以帮助你估计系统的平均传输块大小，这个传输块大小通常和磁盘子系统的条带化大小相符合可以获得最好的性能。

・Blocks read/write per second

这个值表达了每秒读写的blocks数量，在2.6内核中blocks是1024bytes，在早些的内核版本中blocks可以是不同的大小，从512bytes到4kb。

・Kilobytes per second read/write

按照kb为单位表示读写块设备的实际数据的数量。